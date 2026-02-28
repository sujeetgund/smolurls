# smolurls

URL Shortener + Analytics API with MCP support, built using FastAPI and FastMCP on the same port.

## Requirements

- Python 3.12+
- PostgreSQL
- `DATABASE_URL` environment variable

Example:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/smolurls"
```

## Install & Run

```powershell
uv sync
uv run uvicorn main:app --reload
```

Server runs on one port (default: `http://127.0.0.1:8000`) and serves both REST + MCP.

## CORS

The app is configured with global permissive CORS:

- `allow_origins = ["*"]`
- `allow_methods = ["*"]`
- `allow_headers = ["*"]`

This allows browser clients from any origin to call REST routes and the `/mcp` endpoint.

## Project Structure

```text
smolurls/
├─ app/
│  ├─ api/routes.py
│  ├─ application.py
│  ├─ config.py
│  ├─ db.py
│  ├─ mcp_server.py
│  ├─ models.py
│  ├─ schemas.py
│  └─ services.py
├─ main.py
├─ pyproject.toml
└─ README.md
```

## Routes

- `GET /{id}` - Redirect to the long URL (`307`)
- `POST /shorten` - Shorten long URL
- `GET /shorten/{id}` - Get short URL info
- `GET /shorten/all` - Get all shortened URLs
- `GET /analytics/{id}` - Get analytics (click events with IP, user-agent, referrer)
- `/mcp` - MCP endpoint

## MCP Tools

Defined in `app/mcp_server.py` with explicit docstrings for agent discovery:

- `shorten_url(url, custom_alias=None)`
- `get_short_url(short_id)`
- `list_urls()`
- `get_analytics(short_id)`

## API Examples

### Create short URL

`POST /shorten`

```json
{
  "url": "https://example.com/very/long/path",
  "custom_alias": "my-link"
}
```

`custom_alias` is optional and must match `^[A-Za-z0-9_-]{3,32}$`.

### Short URL info

`GET /shorten/my-link`

### List all

`GET /shorten/all`

### Analytics

`GET /analytics/my-link`

Response includes:

- `total_clicks`
- `events[]` with `clicked_at`, `ip_address`, `user_agent`, `referrer`

## Smoke Test (uv-only)

Use a second terminal after starting the server.

```powershell
uv run python -c "import json,urllib.request; req=urllib.request.Request('http://127.0.0.1:8000/shorten', data=json.dumps({'url':'https://example.com','custom_alias':'my-link'}).encode(), headers={'Content-Type':'application/json'}, method='POST'); resp=urllib.request.urlopen(req); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/shorten/my-link'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/shorten/all'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; class NoRedirect(urllib.request.HTTPRedirectHandler):\n    def redirect_request(self, req, fp, code, msg, headers, newurl):\n        return None\n; opener=urllib.request.build_opener(NoRedirect); req=urllib.request.Request('http://127.0.0.1:8000/my-link', method='GET');\ntry:\n    opener.open(req)\nexcept urllib.error.HTTPError as e:\n    print(e.code, e.headers.get('Location'))"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/analytics/my-link'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/mcp'); print(resp.status)"
```
