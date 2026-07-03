# AgentPath Frontend

Next.js 16 (App Router, React 19, Tailwind CSS 4) web app for AgentPath — the AI mentor chat, opportunity browser, roadmap, and profile experience.

Part of the [AgentPath monorepo](../README.md).

## Requirements

- Node.js ≥ 20 (or 18.20+)
- pnpm ≥ 9
- The [backend](../backend/README.md) running on port 4000

## Setup

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then:

```bash
pnpm install                  # from the repo root
pnpm --filter frontend dev    # start the dev server
```

The app runs at `http://localhost:3000`.

> **No CORS in the browser:** `next.config.ts` rewrites `/api/v1/*` to `NEXT_PUBLIC_API_URL`, so all API calls use relative URLs and are proxied through the Next.js server.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint |

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login`, `/register` | Public | Auth pages (`(auth)` route group, no sidebar) |
| `/onboarding` | Auth | First-time setup wizard (university, course, year, goals) |
| `/chat`, `/chat/:id` | Auth | AI mentor — home after login |
| `/opportunities`, `/opportunities/:id` | Auth | Browse and filter opportunities |
| `/roadmap` | Auth | Personal milestones |
| `/profile` | Auth | Profile, password change, logout |

Authenticated sections share the `AppShell` sidebar layout (Chat, Opportunities, Roadmap, Profile).

## Project Structure

```
src/
├── app/
│   ├── (auth)/            /login and /register — no sidebar
│   ├── onboarding/        Setup wizard
│   ├── chat/              Conversation list + [id] chat view (SSE streaming UI)
│   ├── opportunities/     List + detail pages
│   ├── roadmap/           Milestone board
│   ├── profile/           Account settings
│   ├── layout.tsx         Root layout, fonts, metadata
│   ├── sitemap.ts         Dynamic sitemap
│   └── opengraph-image.tsx / twitter-image.tsx   Dynamic social images
├── components/
│   ├── layout/            AppShell (sidebar nav), AppLayout
│   └── ui/                Button, Input, Select, Logo, … (Radix + CVA)
├── hooks/
│   └── useAuth.ts         Client-side auth check + onboarding redirect
├── lib/api/
│   ├── client.ts          clientFetch() — attaches Bearer token from localStorage
│   └── server.ts          Server-side fetch helper
├── services/              One typed API module per backend feature
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── chat.service.ts    Includes streamMessage() SSE reader
│   ├── opportunities.service.ts
│   └── roadmap.service.ts
├── providers/             React Query provider
└── middleware.ts          Cookie-based route redirects
```

## How Auth Works

- On login/register the API returns `{ user, accessToken }`. The JWT is stored in `localStorage` under `token`, and a lightweight `ap_session=1` cookie is set.
- `middleware.ts` uses the `ap_session` cookie only for coarse redirects (no cookie → `/login`; logged in → away from auth pages). It does **not** validate the token.
- Real enforcement is client-side: `useAuth` calls `GET /auth/me` on mount, redirects to `/login` on failure, and pushes un-onboarded users to `/onboarding`.
- `clientFetch()` in `src/lib/api/client.ts` attaches `Authorization: Bearer <token>` to every request. Pages never call `fetch` directly — always go through `src/services/`.

## Chat Streaming

`streamMessage()` in `src/services/chat.service.ts` POSTs the user's message and reads the SSE response manually with `fetch` + `ReadableStream`:

- Each `data: {"chunk": "..."}` line invokes `onChunk(chunk)` — the UI appends it live with a blinking cursor
- `data: {"done": true}` invokes `onDone()` — the message is finalized (the backend has already persisted it)

## Conventions

- **Services layer** — one file per backend module with typed functions; components import from `@/services/*`, never `fetch` directly.
- **React Query** for client-side data fetching and mutations (`src/providers/QueryProvider.tsx`).
- **UI primitives** in `src/components/ui/` built on Radix UI + `class-variance-authority`, merged with `tailwind-merge` via the `cn()` helper in `src/utilities/ui.ts`.
- **Shared types** come from `packages/shared` where applicable.
