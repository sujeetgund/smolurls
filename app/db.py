from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from .config import DATABASE_URL


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL)


def init_db() -> None:
    from . import models

    Base.metadata.create_all(engine)
