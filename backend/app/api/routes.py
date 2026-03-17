from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import RedirectResponse

from app.config import BASE_URL
from app.schemas import (
    ClickEventResponse,
    ShortenRequest,
    ShortURLInfoResponse,
    ShortURLResponse,
    URLAnalyticsResponse,
)
from app.services import (
    AliasConflictError,
    AliasValidationError,
    IdGenerationError,
    NotFoundError,
    create_short_url,
    get_url_analytics,
    get_short_url_info,
    list_short_urls,
    resolve_and_track_redirect,
)


router = APIRouter()


def build_short_url(short_id: str) -> str:
    return f"{BASE_URL}/{short_id}"


@router.post(
    "/shorten",
    response_model=ShortURLResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="create_short_url",
    tags=["urls"],
)
def create_short_url_route(
    payload: ShortenRequest,
) -> ShortURLResponse:
    try:
        short = create_short_url(str(payload.url), payload.custom_alias)
    except AliasValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    except AliasConflictError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=str(exc)
        ) from exc
    except IdGenerationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc

    return ShortURLResponse(
        id=short.id,
        long_url=short.long_url,
        short_url=build_short_url(short.id),
        created_at=short.created_at,
    )


@router.get(
    "/shorten/all",
    response_model=list[ShortURLInfoResponse],
    operation_id="list_short_urls",
    tags=["urls"],
)
def list_short_urls_route() -> list[ShortURLInfoResponse]:
    rows = list_short_urls()
    return [
        ShortURLInfoResponse(
            id=short.id,
            long_url=short.long_url,
            short_url=build_short_url(short.id),
            created_at=short.created_at,
            total_clicks=total_clicks,
        )
        for short, total_clicks in rows
    ]


@router.get(
    "/shorten/{id}",
    response_model=ShortURLInfoResponse,
    operation_id="get_short_url_info",
    tags=["urls"],
)
def get_short_url_info_route(id: str) -> ShortURLInfoResponse:
    try:
        short, total_clicks = get_short_url_info(id)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        ) from exc

    return ShortURLInfoResponse(
        id=short.id,
        long_url=short.long_url,
        short_url=build_short_url(short.id),
        created_at=short.created_at,
        total_clicks=total_clicks,
    )


@router.get(
    "/analytics/{id}",
    response_model=URLAnalyticsResponse,
    operation_id="get_url_analytics",
    tags=["analytics"],
)
def get_url_analytics_route(id: str) -> URLAnalyticsResponse:
    try:
        short, events = get_url_analytics(id)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        ) from exc

    return URLAnalyticsResponse(
        id=short.id,
        long_url=short.long_url,
        short_url=build_short_url(short.id),
        total_clicks=len(events),
        events=[
            ClickEventResponse(
                clicked_at=event.clicked_at,
                ip_address=event.ip_address,
                user_agent=event.user_agent,
                referrer=event.referrer,
            )
            for event in events
        ],
    )


@router.get("/{id}", operation_id="redirect_short_url", tags=["redirects"])
def redirect_short_url_route(id: str, request: Request) -> RedirectResponse:
    try:
        long_url = resolve_and_track_redirect(
            short_id=id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            referrer=request.headers.get("referer"),
        )
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        ) from exc

    return RedirectResponse(
        url=long_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT
    )
