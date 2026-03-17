<div align="center">
<img width="400" alt="smolurls" src="https://github.com/user-attachments/assets/caddb735-dd96-4b9f-8a95-7344c8296367" />
</div>
<br>

A clean, production-ready URL shortener with analytics and native MCP tooling — built on FastAPI + FastMCP and Next.js, served from a single backend port.

## Features

- Fast URL shortening with optional custom aliases
- Redirect tracking with per-click event data (IP, user-agent, referrer)
- MCP tools for agent-native access — shorten, lookup, list, and analytics
- Single service surface: REST API + MCP on the same port
- Next.js frontend with analytics charts

## Documentation

| Doc                                  | Description                                                               |
| ------------------------------------ | ------------------------------------------------------------------------- |
| [docs/backend.md](docs/backend.md)   | FastAPI service — routes, architecture, database schema, deployment       |
| [docs/mcp.md](docs/mcp.md)           | MCP endpoint — tools, transport, client setup (Claude Desktop, Cursor, …) |
| [docs/frontend.md](docs/frontend.md) | Next.js frontend — pages, API client, environment variables               |

## Quick start

### Backend

```powershell
cd backend
$env:DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/smolurls"
$env:BASE_URL     = "http://127.0.0.1:8000/api/v1"
uv sync
uv run uvicorn main:app --reload
```

### Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

## Project structure

```
smolurls/
├── backend/          # FastAPI + FastMCP service
├── frontend/         # Next.js application
└── docs/             # Documentation
    ├── backend.md
    ├── mcp.md
    └── frontend.md
```
