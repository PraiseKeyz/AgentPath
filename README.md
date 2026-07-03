# AgentPath

AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.

AgentPath pairs students with a conversational AI mentor that helps them discover scholarships, fellowships, internships, and competitions — and guides them through applications. The defining design principle is **agency-first**: the AI always asks the student what they think or want before surfacing options. It never leads with a list.

## Features

- 🤖 **AI mentor chat** — streaming conversations with full memory, grounded in the student's profile and a curated opportunity database
- 🎯 **Opportunities** — browsable, filterable database of Nigerian scholarships, fellowships, internships, and competitions
- 🗺️ **Roadmap** — personal milestones students can create and track, optionally linked to opportunities
- 👤 **Onboarding** — a short wizard that captures university, course, year of study, and goals to personalize the mentor

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | [NestJS 11](backend/) (Node.js, Express) |
| Frontend | [Next.js 16](frontend/) (React 19, App Router, Tailwind CSS 4) |
| Database | MongoDB via Mongoose |
| Auth | JWT (Passport) with argon2 password hashing |
| AI | Groq API (`llama-3.3-70b-versatile` by default, configurable) |
| Monorepo | pnpm workspaces |

## Repository Structure

```
AgentPath/
├── backend/          NestJS API — auth, users, chat, AI, opportunities, roadmap
├── frontend/         Next.js app — landing, auth, onboarding, chat, opportunities, roadmap, profile
├── packages/
│   └── shared/       TypeScript interfaces shared between backend and frontend
├── DOCS.md           Extended developer documentation
├── pnpm-workspace.yaml
└── package.json      Workspace scripts (dev, build, start, lint)
```

Each app has its own README with setup details:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Quick Start

**Prerequisites:** Node.js ≥ 20 (or 18.20+), pnpm ≥ 9, a running MongoDB instance, and a [Groq API key](https://console.groq.com/).

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Configure environment
#    backend/.env        — see backend/README.md
#    frontend/.env.local — see frontend/README.md

# 3. Seed the opportunities database (optional but recommended)
pnpm --filter backend seed

# 4. Start both apps in parallel
pnpm dev
```

- API: `http://localhost:4000/api/v1`
- Web: `http://localhost:3000`

### Workspace scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run backend and frontend in parallel (watch mode) |
| `pnpm dev:backend` | Backend only |
| `pnpm dev:frontend` | Frontend only |
| `pnpm build` | Build backend, then frontend |
| `pnpm start` | Run both production builds |
| `pnpm lint` | Lint the frontend |

## How It Works

1. A student registers, completes onboarding (university, course, year, goals), and lands in the chat.
2. Messages are sent to the backend, which builds a system prompt from the student's profile plus the active opportunities in the database, and streams the AI response back over Server-Sent Events (SSE).
3. The AI engages before it suggests — reflecting the student's goals, asking clarifying questions, and only then surfacing matching opportunities.
4. Students save next steps as roadmap milestones and can browse the opportunity database independently at any time.

For data models, API endpoints, and architecture details, see [DOCS.md](DOCS.md).
