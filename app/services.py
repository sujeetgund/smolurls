import re
import secrets
import string

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .db import engine
from .models import ClickEvent, ShortURL


ALIAS_PATTERN = re.compile(r"^[A-Za-z0-9_-]{3,32}$")
ID_ALPHABET = string.ascii_letters + string.digits
ID_LENGTH = 7


class AliasValidationError(Exception):
    pass


class AliasConflictError(Exception):
    pass


class NotFoundError(Exception):
    pass


class IdGenerationError(Exception):
    pass


def generate_id() -> str:
    return "".join(secrets.choice(ID_ALPHABET) for _ in range(ID_LENGTH))


def ensure_valid_alias(value: str) -> None:
    if not ALIAS_PATTERN.match(value):
        raise AliasValidationError("custom_alias must match ^[A-Za-z0-9_-]{3,32}$")


def create_short_url(url: str, custom_alias: str | None = None) -> ShortURL:
    alias = custom_alias.strip() if custom_alias else None
    if alias:
        ensure_valid_alias(alias)

    with Session(engine) as session:
        if alias:
            existing = session.get(ShortURL, alias)
            if existing:
                raise AliasConflictError("custom_alias already exists")
            short_id = alias
        else:
            short_id = ""
            for _ in range(10):
                candidate = generate_id()
                if session.get(ShortURL, candidate) is None:
                    short_id = candidate
                    break
            if not short_id:
                raise IdGenerationError("Failed to generate unique short id")

        record = ShortURL(id=short_id, long_url=url)
        session.add(record)
        session.commit()
        session.refresh(record)
        return record


def list_short_urls() -> list[tuple[ShortURL, int]]:
    with Session(engine) as session:
        rows = session.execute(
            select(ShortURL, func.count(ClickEvent.event_id).label("total_clicks"))
            .outerjoin(ClickEvent, ClickEvent.short_id == ShortURL.id)
            .group_by(ShortURL.id)
            .order_by(ShortURL.created_at.desc())
        ).all()
        return [(short, int(total_clicks)) for short, total_clicks in rows]


def get_short_url_info(short_id: str) -> tuple[ShortURL, int]:
    with Session(engine) as session:
        row = session.execute(
            select(ShortURL, func.count(ClickEvent.event_id).label("total_clicks"))
            .outerjoin(ClickEvent, ClickEvent.short_id == ShortURL.id)
            .where(ShortURL.id == short_id)
            .group_by(ShortURL.id)
        ).first()
        if row is None:
            raise NotFoundError("Short URL not found")
        short, total_clicks = row
        return short, int(total_clicks)


def get_url_analytics(short_id: str) -> tuple[ShortURL, list[ClickEvent]]:
    with Session(engine) as session:
        short = session.get(ShortURL, short_id)
        if short is None:
            raise NotFoundError("Short URL not found")

        events = (
            session.execute(
                select(ClickEvent)
                .where(ClickEvent.short_id == short_id)
                .order_by(ClickEvent.clicked_at.desc())
            )
            .scalars()
            .all()
        )
        return short, events


def resolve_and_track_redirect(
    short_id: str,
    ip_address: str | None,
    user_agent: str | None,
    referrer: str | None,
) -> str:
    with Session(engine) as session:
        short = session.get(ShortURL, short_id)
        if short is None:
            raise NotFoundError("Short URL not found")

        event = ClickEvent(
            short_id=short_id,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
        )
        session.add(event)
        session.commit()
        return short.long_url
