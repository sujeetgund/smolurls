# smolurls

A clean, production-ready URL shortener with analytics and native MCP tooling—built on FastAPI + FastMCP, served on a single port.

## Why this project

- Fast URL shortening with optional custom aliases
- Redirect tracking with per-click event data
- MCP tools for agent-native access to shorten, lookup, list, and analytics
- Single service surface: REST + MCP together

## Requirements

- Python 3.12+
- PostgreSQL
- `DATABASE_URL` and `BASE_URL` set in your environment

Example:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/smolurls"
$env:BASE_URL = "http://127.0.0.1:8000/api/v1"
```

## Run locally

```powershell
uv sync
uv run uvicorn main:app --reload
```

Default server: `http://127.0.0.1:8000`

## Run with Docker

Build:

```powershell
docker build -t smolurls .
```

Run:

```powershell
docker run --rm -p 8080:8080 -e DATABASE_URL="postgresql+psycopg://postgres:postgres@host.docker.internal:5432/smolurls" smolurls
```

Add `BASE_URL` when running containers (example):

```powershell
docker run --rm -p 8080:8080 -e DATABASE_URL="postgresql+psycopg://postgres:postgres@host.docker.internal:5432/smolurls" -e BASE_URL="http://localhost:8080" smolurls
```

Container entrypoint runs:
`uvicorn main:app --log-level info --host 0.0.0.0 --port ${PORT}`

## CORS

Global permissive CORS is enabled:

- `allow_origins = ["*"]`
- `allow_methods = ["*"]`
- `allow_headers = ["*"]`

## API routes

- `GET /api/v1/{id}` → redirect to original URL (`307`)
- `POST /api/v1/shorten` → create short URL
- `GET /api/v1/shorten/{id}` → get one short URL
- `GET /api/v1/shorten/all` → list all short URLs
- `GET /api/v1/analytics/{id}` → analytics for one short URL
- `GET /mcp` → MCP endpoint

## MCP tools

Defined in `app/mcp_server.py`:

- `shorten_url(url, custom_alias=None)`
- `get_short_url(short_id)`
- `list_urls()`
- `get_analytics(short_id)`

## Request example

`POST /api/v1/shorten`

```json
{
  "url": "https://example.com/very/long/path",
  "custom_alias": "my-link"
}
```

`custom_alias` is optional and must match: `^[A-Za-z0-9_-]{3,32}$`

## Analytics response shape

- `total_clicks`
- `events[]`
  - `clicked_at`
  - `ip_address`
  - `user_agent`
  - `referrer`

## ER Diagram

```mermaid
erDiagram
  SHORT_URLS {
    string id PK
    text long_url
    datetime created_at
  }

  CLICK_EVENTS {
    int event_id PK
    string short_id FK
    datetime clicked_at
    string ip_address
    text user_agent
    text referrer
  }

  SHORT_URLS ||--o{ CLICK_EVENTS : tracks
```

## Project layout

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

## Smoke test (uv-only)

Run in a second terminal after the server starts.

```powershell
uv run python -c "import json,urllib.request; req=urllib.request.Request('http://127.0.0.1:8000/api/v1/shorten', data=json.dumps({'url':'https://example.com','custom_alias':'my-link'}).encode(), headers={'Content-Type':'application/json'}, method='POST'); resp=urllib.request.urlopen(req); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/shorten/my-link'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/shorten/all'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; class NoRedirect(urllib.request.HTTPRedirectHandler):\n    def redirect_request(self, req, fp, code, msg, headers, newurl):\n        return None\n; opener=urllib.request.build_opener(NoRedirect); req=urllib.request.Request('http://127.0.0.1:8000/api/v1/my-link', method='GET');\ntry:\n    opener.open(req)\nexcept urllib.error.HTTPError as e:\n    print(e.code, e.headers.get('Location'))"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/analytics/my-link'); print(resp.status, resp.read().decode())"
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/mcp'); print(resp.status)"
```
