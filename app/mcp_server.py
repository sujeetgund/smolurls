from fastmcp import FastMCP

from .services import (
    AliasConflictError,
    AliasValidationError,
    IdGenerationError,
    NotFoundError,
    create_short_url,
    get_url_analytics,
    get_short_url_info,
    list_short_urls,
)


mcp = FastMCP("smolurls")


@mcp.tool
def shorten_url(url: str, custom_alias: str | None = None) -> dict:
    """Create a short URL from a long URL.

    Use this tool when you need to generate a new short link.
    Optionally provide `custom_alias` to request a specific short ID.
    """
    try:
        short = create_short_url(url=url, custom_alias=custom_alias)
    except (AliasValidationError, AliasConflictError, IdGenerationError) as exc:
        raise ValueError(str(exc)) from exc

    return {
        "id": short.id,
        "long_url": short.long_url,
        "created_at": short.created_at.isoformat(),
    }


@mcp.tool
def get_short_url(short_id: str) -> dict:
    """Get metadata for one short URL by ID.

    Use this tool when you already have a short ID and need the target long URL and click count.
    """
    try:
        short, total_clicks = get_short_url_info(short_id)
    except NotFoundError as exc:
        raise ValueError(str(exc)) from exc

    return {
        "id": short.id,
        "long_url": short.long_url,
        "created_at": short.created_at.isoformat(),
        "total_clicks": total_clicks,
    }


@mcp.tool
def list_urls() -> list[dict]:
    """List all shortened URLs with total click counts.

    Use this tool when you need a full inventory of short URLs and summary usage stats.
    """
    rows = list_short_urls()
    return [
        {
            "id": short.id,
            "long_url": short.long_url,
            "created_at": short.created_at.isoformat(),
            "total_clicks": total_clicks,
        }
        for short, total_clicks in rows
    ]


@mcp.tool
def get_analytics(short_id: str) -> dict:
    """Get detailed analytics for a short URL.

    Use this tool when you need click history including timestamp, IP address, user-agent, and referrer.
    """
    try:
        short, events = get_url_analytics(short_id)
    except NotFoundError as exc:
        raise ValueError(str(exc)) from exc

    return {
        "id": short.id,
        "long_url": short.long_url,
        "total_clicks": len(events),
        "events": [
            {
                "clicked_at": event.clicked_at.isoformat(),
                "ip_address": event.ip_address,
                "user_agent": event.user_agent,
                "referrer": event.referrer,
            }
            for event in events
        ],
    }
