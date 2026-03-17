# Frontend

Next.js 16 application that provides the UI for smolurls — URL shortening, link management, analytics, and MCP setup instructions.

## Stack

| Component     | Library / Version       |
| ------------- | ----------------------- |
| Framework     | Next.js 16 (App Router) |
| Language      | TypeScript 5            |
| Styling       | Tailwind CSS 4          |
| UI primitives | shadcn/ui + Base UI     |
| Charts        | Recharts 3              |
| Icons         | Lucide React            |
| Package mgr   | pnpm (workspace)        |

## Project layout

```
frontend/
├── app/
│   ├── layout.tsx                        # Root layout (navbar, fonts, globals)
│   ├── page.tsx                          # Home — URL shortening form
│   ├── urls/
│   │   ├── page.tsx                      # All shortened URLs list
│   │   └── _components/url-list.tsx
│   ├── analytics/
│   │   └── [id]/
│   │       ├── page.tsx                  # Per-URL analytics detail page
│   │       └── _components/
│   │           ├── analytics-view.tsx
│   │           ├── clicks-chart.tsx      # Recharts time-series chart
│   │           └── events-table.tsx      # Click events table
│   └── mcp/
│       ├── page.tsx                      # MCP setup guide page
│       └── _components/mcp-page.tsx
├── components/
│   ├── copy-button.tsx
│   ├── loading-skeleton.tsx
│   ├── navbar.tsx
│   ├── page-transition.tsx
│   ├── section-reveal.tsx
│   └── ui/                               # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       └── tooltip.tsx
├── lib/
│   ├── api.ts                            # Typed fetch wrappers for the backend REST API
│   ├── mcp-docs.ts                       # MCP tool definitions and setup snippets (static)
│   ├── types.ts                          # Shared TypeScript interfaces
│   └── utils.ts                          # cn() and other utilities
└── public/
```

## Pages

### `/` — Home

URL shortening form. Users paste a long URL, optionally toggle a custom alias field, and submit. The created short URL and its copy button are shown inline on success.

### `/urls` — All URLs

Server-rendered page that fetches `GET /api/v1/shorten/all` and renders a table of all shortened links with click counts and copy buttons.

### `/analytics/[id]` — Analytics

Server-rendered page that fetches `GET /api/v1/analytics/{id}` for a specific short URL. Displays:

- Summary card (total clicks, creation date, long URL)
- `clicks-chart` — Recharts time-series bar chart of clicks grouped by day
- `events-table` — Full click event log (timestamp, IP, referrer, user-agent)

### `/mcp` — MCP setup

Static page that explains how to connect MCP-compatible clients to the smolurls MCP endpoint. Includes syntax-highlighted config snippets for Claude Desktop, Cursor, and a generic Python client.

## API client (`lib/api.ts`)

All backend calls go through the `apiFetch` helper, which reads `NEXT_PUBLIC_API_URL` (falls back to `http://127.0.0.1:8000/api/v1`).

| Function       | Method | Path              | Returns                  |
| -------------- | ------ | ----------------- | ------------------------ |
| `shortenUrl`   | POST   | `/shorten`        | `ShortURLResponse`       |
| `listUrls`     | GET    | `/shorten/all`    | `ShortURLInfoResponse[]` |
| `getUrlInfo`   | GET    | `/shorten/{id}`   | `ShortURLInfoResponse`   |
| `getAnalytics` | GET    | `/analytics/{id}` | `URLAnalyticsResponse`   |

Error responses from the backend are surfaced as thrown `Error` objects with the `detail` field message.

## TypeScript types (`lib/types.ts`)

```ts
interface ShortenRequest       { url: string; custom_alias?: string }
interface ShortURLResponse     { id; long_url; short_url; created_at }
interface ShortURLInfoResponse { id; long_url; short_url; created_at; total_clicks }
interface ClickEventResponse   { clicked_at; ip_address; user_agent; referrer }
interface URLAnalyticsResponse { id; short_url; long_url; total_clicks; events[] }
```

## Environment variables

| Variable              | Default                        | Description               |
| --------------------- | ------------------------------ | ------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000/api/v1` | Backend REST API base URL |

## Run locally

```powershell
cd frontend
pnpm install
pnpm dev
```

Development server: `http://localhost:3000`

## Build

```powershell
cd frontend
pnpm build
pnpm start
```

## Lint

```powershell
cd frontend
pnpm lint
```
