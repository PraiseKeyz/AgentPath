# AgentPath Backend

NestJS 11 API for AgentPath — auth, student profiles, AI mentor chat, opportunities, and roadmaps, backed by MongoDB.

Part of the [AgentPath monorepo](../README.md).

## Requirements

- Node.js ≥ 20 (or 18.20+)
- pnpm ≥ 9
- MongoDB (local or hosted)
- A [Groq API key](https://console.groq.com/) for the AI mentor

## Setup

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agentpath
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
AI_MODEL=llama-3.3-70b-versatile
FRONTEND_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `PORT` | API port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | JWT signing secret and lifetime |
| `GROQ_API_KEY` | Groq API key for AI responses |
| `AI_MODEL` | Groq model id — swap without touching code (`llama-3.3-70b-versatile` default, `llama-3.1-8b-instant` for lower latency) |
| `FRONTEND_URL` | Extra allowed CORS origin(s), comma-separated. `localhost:3000`/`3001` are always allowed |

Then:

```bash
pnpm install                 # from the repo root
pnpm --filter backend seed   # populate the opportunities collection
pnpm --filter backend dev    # start in watch mode
```

The API runs at `http://localhost:4000/api/v1`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start with watch mode (`nest start --watch`) |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run the production build |
| `pnpm seed` | Seed the opportunities collection (`node seed.cjs`) |
| `pnpm lint` | ESLint with autofix |
| `pnpm test` | Jest unit tests |

## Project Structure

```
src/
├── main.ts               Bootstrap — global prefix /api, URI versioning (v1),
│                         validation pipe, CORS allowlist, compression, cookies
├── app.module.ts         Root module — Mongoose, throttling, global guards
├── common/
│   ├── decorators/       @Public(), @CurrentUser(), @Roles()
│   ├── filters/          HttpExceptionFilter — standard error envelope
│   ├── interceptors/     TransformInterceptor — standard success envelope
│   └── constants/        SafeUser shape (user without password)
├── auth/                 Register, login, me, change-password; JWT strategy + guard
├── users/                Profile updates, onboarding completion
├── chat/                 Conversations + messages, SSE streaming endpoint
├── ai/                   Groq integration — system prompt building + token streaming
├── opportunities/        Curated opportunity database (list, filter, detail)
└── roadmap/              One roadmap per user with embedded milestones
```

## Conventions

- **Auth by default** — a global `JwtAuthGuard` protects every route; public endpoints opt out with `@Public()`. The authenticated user is injected with `@CurrentUser()`.
- **Response envelope** — controllers return `{ message, data }`; the `TransformInterceptor` wraps this into:
  ```json
  { "success": true, "message": "...", "data": {}, "error": null, "timestamp": "..." }
  ```
  Errors are shaped the same way by `HttpExceptionFilter` with `success: false` and an `error` object.
- **Rate limiting** — global throttle of 120 requests/minute per client.
- **Validation** — global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted`; every body has a DTO in the module's `dto/` folder.
- **Module layout** — each module has `*.module.ts`, `*.controller.ts`, `*.service.ts`, and `dto/` / `schemas/` as needed.

## API Endpoints

Base path: `/api/v1`

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account, returns `{ user, accessToken }` |
| POST | `/auth/login` | Public | Login, returns `{ user, accessToken }` |
| GET | `/auth/me` | JWT | Current authenticated user |
| POST | `/auth/change-password` | JWT | Change password |

### Users
| Method | Path | Description |
|---|---|---|
| PATCH | `/users/profile` | Update profile fields |
| POST | `/users/onboarding` | Complete onboarding (sets `isOnboarded: true`) |

### Chat
| Method | Path | Description |
|---|---|---|
| GET | `/chat/conversations` | List the current user's conversations |
| POST | `/chat/conversations` | Start a new conversation |
| GET | `/chat/conversations/:id` | Get a conversation with its messages |
| POST | `/chat/conversations/:id/messages` | Send a message — streams the AI reply via SSE |
| DELETE | `/chat/conversations/:id` | Delete a conversation and its messages |

### Opportunities
| Method | Path | Description |
|---|---|---|
| GET | `/opportunities` | List active opportunities (`?type=`, `?tag=`, `?q=`) |
| GET | `/opportunities/:id` | Get a single opportunity |

### Roadmap
| Method | Path | Description |
|---|---|---|
| GET | `/roadmap` | Get the current user's roadmap |
| POST | `/roadmap/milestones` | Add a milestone |
| PATCH | `/roadmap/milestones/:id` | Update a milestone |
| DELETE | `/roadmap/milestones/:id` | Remove a milestone |

## AI Mentor

`AiService` builds a per-request system prompt containing:

1. The student's profile — name, university, course, year, stated goals
2. A summary of every **active** opportunity in the database
3. The agency-first instructions — always ask before suggesting, warm peer-like tone, explain all acronyms, never open with a list

The full conversation history is sent on every request (memory via MongoDB). Responses stream token-by-token as Server-Sent Events:

```
data: {"chunk": "..."}
data: {"chunk": "..."}
data: {"done": true}
```

The complete response is persisted as a `Message` after streaming finishes.
