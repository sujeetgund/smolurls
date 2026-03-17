# MCP

smolurls exposes a native MCP (Model Context Protocol) endpoint that lets AI agents and MCP-compatible IDE extensions shorten URLs, look up links, and fetch analytics without going through the REST API directly.

## Transport

| Property | Value                                   |
| -------- | --------------------------------------- |
| Protocol | MCP over Streamable HTTP                |
| Path     | `/mcp`                                  |
| Live URL | `https://smolurls.sujeetbuilds.xyz/mcp` |

## Available tools

| Tool            | Category  | Parameters             | Description                                                            |
| --------------- | --------- | ---------------------- | ---------------------------------------------------------------------- |
| `shorten_url`   | urls      | `url`, `custom_alias?` | Create a short URL from a long URL. Optionally provide a custom alias. |
| `get_short_url` | urls      | `short_id`             | Get metadata for one short URL — target long URL and click count.      |
| `list_urls`     | urls      | —                      | List all shortened URLs with total click counts.                       |
| `get_analytics` | analytics | `short_id`             | Get detailed click history (timestamp, IP, user-agent, referrer).      |

### `shorten_url`

```
shorten_url(url: str, custom_alias: str | None = None) → dict
```

Returns:

```json
{
  "id": "my-link",
  "long_url": "https://example.com/very/long/path",
  "short_url": "https://smolurls.sujeetbuilds.xyz/api/v1/my-link",
  "created_at": "2026-03-17T10:00:00+00:00"
}
```

Raises `ValueError` on invalid alias format, alias conflict, or ID generation failure.

### `get_short_url`

```
get_short_url(short_id: str) → dict
```

Returns:

```json
{
  "id": "my-link",
  "short_url": "https://smolurls.sujeetbuilds.xyz/api/v1/my-link",
  "long_url": "https://example.com/very/long/path",
  "created_at": "2026-03-17T10:00:00+00:00",
  "total_clicks": 42
}
```

### `list_urls`

```
list_urls() → list[dict]
```

Returns an array of objects with the same shape as `get_short_url`.

### `get_analytics`

```
get_analytics(short_id: str) → dict
```

Returns:

```json
{
  "id": "my-link",
  "long_url": "https://example.com/very/long/path",
  "short_url": "https://smolurls.sujeetbuilds.xyz/api/v1/my-link",
  "total_clicks": 3,
  "events": [
    {
      "clicked_at": "2026-03-17T10:05:00+00:00",
      "ip_address": "203.0.113.1",
      "user_agent": "Mozilla/5.0 ...",
      "referrer": "https://referrer.example.com"
    }
  ]
}
```

## Compatible clients

- Claude Desktop
- Cursor
- Windsurf
- Zed
- Any MCP HTTP client

## Client setup

### Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "smolurls": {
      "type": "http",
      "url": "https://smolurls.sujeetbuilds.xyz/mcp"
    }
  }
}
```

### Cursor

Create / edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "smolurls": {
      "type": "http",
      "url": "https://smolurls.sujeetbuilds.xyz/mcp"
    }
  }
}
```

### Generic Python client

```python
from mcp import ClientSession
from mcp.client.http import http_client

async with http_client("https://smolurls.sujeetbuilds.xyz/mcp") as (r, w):
    async with ClientSession(r, w) as session:
        await session.initialize()
        tools = await session.list_tools()
```

## Implementation

The MCP server is defined in `backend/app/mcp_server.py` using [FastMCP](https://github.com/jlowin/fastmcp). It is mounted at `/mcp` on the same FastAPI application instance as the REST API (`backend/app/application.py`), so both share one process and port.

```
FastAPI app
├── /api/v1/*   ← REST router
└── /mcp/*      ← FastMCP (Streamable HTTP)
```

Each MCP tool delegates to the same service functions used by the REST routes, so business logic is not duplicated.
