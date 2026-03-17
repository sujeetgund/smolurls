# Backend

FastAPI service that provides URL shortening, redirect tracking, and analytics. The REST API and MCP endpoint share one process on a single port.

## Stack

| Component  | Library / Version                  |
| ---------- | ---------------------------------- |
| Framework  | FastAPI ≥ 0.115                    |
| MCP        | FastMCP ≥ 2.0                      |
| ORM        | SQLAlchemy ≥ 2.0                   |
| Validation | Pydantic ≥ 2.9 / pydantic-settings |
| Server     | Uvicorn (standard extras)          |
| Database   | PostgreSQL via psycopg2            |
| Runtime    | Python ≥ 3.12                      |

## Project layout

```
backend/
├── app/
│   ├── api/
│   │   └── routes.py       # FastAPI router – all REST endpoints
│   ├── application.py      # App factory: mounts REST + MCP on one FastAPI instance
│   ├── config.py           # Settings (DATABASE_URL, BASE_URL) via pydantic-settings
│   ├── db.py               # SQLAlchemy engine + Base + init_db()
│   ├── mcp_server.py       # FastMCP instance + tool definitions
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic request/response schemas
│   └── services.py         # Business logic layer
├── main.py                 # Uvicorn entry-point
├── pyproject.toml
└── Dockerfile
```

## Architecture

```
                ┌─────────────────────────────────────────┐
                │              FastAPI app                │
                │                                         │
  REST client ──►  /api/v1/*   ──► APIRouter (routes.py) │
                │                        │                │
  MCP client  ──►  /mcp/*      ──► FastMCP (mcp_server)  │
                │                        │                │
                │               services.py               │
                │                   │                     │
                │            SQLAlchemy engine             │
                │                   │                     │
                └───────────────────┼─────────────────────┘
                                    │
                              PostgreSQL
```

## Configuration

Both environment variables are required. They can be set directly or via a `.env` file in the `backend/` directory.

| Variable       | Description                                     | Example                                                          |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (psycopg driver)   | `postgresql+psycopg://postgres:postgres@localhost:5432/smolurls` |
| `BASE_URL`     | Public base URL used to build short link values | `http://127.0.0.1:8000/api/v1`                                   |

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/smolurls"
$env:BASE_URL     = "http://127.0.0.1:8000/api/v1"
```

## Database schema (ER diagram)

```mermaid
erDiagram
  SHORT_URLS {
    string  id         PK
    text    long_url
    datetime created_at
  }

  CLICK_EVENTS {
    int      event_id   PK
    string   short_id   FK
    datetime clicked_at
    string   ip_address
    text     user_agent
    text     referrer
  }

  SHORT_URLS ||--o{ CLICK_EVENTS : tracks
```

Tables are created automatically by `init_db()` on startup (SQLAlchemy `create_all`).

## API routes

All REST routes are prefixed with `/api/v1`.

| Method | Path              | Description                           | Status codes       |
| ------ | ----------------- | ------------------------------------- | ------------------ |
| POST   | `/shorten`        | Create a short URL                    | 201, 409, 422, 503 |
| GET    | `/shorten/all`    | List all short URLs with click counts | 200                |
| GET    | `/shorten/{id}`   | Get one short URL with click count    | 200, 404           |
| GET    | `/analytics/{id}` | Get click events for one short URL    | 200, 404           |
| GET    | `/{id}`           | Redirect to the original long URL     | 307, 404           |
| GET    | `/mcp`            | MCP endpoint (Streamable HTTP)        | —                  |

### POST `/api/v1/shorten`

Request body:

```json
{
  "url": "https://example.com/very/long/path",
  "custom_alias": "my-link"
}
```

`custom_alias` is optional and must match `^[A-Za-z0-9_-]{3,32}$`.

Response `201`:

```json
{
  "id": "my-link",
  "long_url": "https://example.com/very/long/path",
  "short_url": "http://127.0.0.1:8000/api/v1/my-link",
  "created_at": "2026-03-17T10:00:00+00:00"
}
```

Error responses:

| Condition                    | Status | Detail message                                  |
| ---------------------------- | ------ | ----------------------------------------------- |
| Invalid alias format         | 422    | `custom_alias must match ^[A-Za-z0-9_-]{3,32}$` |
| Alias already taken          | 409    | `custom_alias already exists`                   |
| Could not generate unique ID | 503    | `Failed to generate unique short id`            |

### GET `/api/v1/analytics/{id}`

Response `200`:

```json
{
  "id": "my-link",
  "short_url": "http://127.0.0.1:8000/api/v1/my-link",
  "long_url": "https://example.com/very/long/path",
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

## CORS

Global permissive CORS is enabled for cross-origin frontend access:

```python
allow_origins     = ["*"]
allow_credentials = False
allow_methods     = ["*"]
allow_headers     = ["*"]
expose_headers    = ["*"]
```

## Run locally

```powershell
cd backend
uv sync
uv run uvicorn main:app --reload
```

Default server: `http://127.0.0.1:8000`

## Run with Docker

Build:

```powershell
docker build -t smolurls ./backend
```

Run (replace connection string as needed):

```powershell
docker run --rm -p 8080:8080 `
  -e DATABASE_URL="postgresql+psycopg://postgres:postgres@host.docker.internal:5432/smolurls" `
  -e BASE_URL="http://localhost:8080/api/v1" `
  smolurls
```

The Dockerfile uses a two-stage build (Python 3.13 slim). The container listens on port `$PORT` (default `8080`).

## Smoke tests

Run these in a second terminal after the server starts:

```powershell
# Create a short URL
uv run python -c "import json,urllib.request; req=urllib.request.Request('http://127.0.0.1:8000/api/v1/shorten', data=json.dumps({'url':'https://example.com','custom_alias':'my-link'}).encode(), headers={'Content-Type':'application/json'}, method='POST'); resp=urllib.request.urlopen(req); print(resp.status, resp.read().decode())"

# Look up the short URL
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/shorten/my-link'); print(resp.status, resp.read().decode())"

# List all short URLs
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/shorten/all'); print(resp.status, resp.read().decode())"

# Test redirect (expect 307)
uv run python -c "
import urllib.request
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None
opener = urllib.request.build_opener(NoRedirect)
try:
    opener.open(urllib.request.Request('http://127.0.0.1:8000/api/v1/my-link'))
except urllib.error.HTTPError as e:
    print(e.code, e.headers.get('Location'))"

# Analytics
uv run python -c "import urllib.request; resp=urllib.request.urlopen('http://127.0.0.1:8000/api/v1/analytics/my-link'); print(resp.status, resp.read().decode())"
```
