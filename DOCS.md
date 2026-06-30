# AgentPath — Developer Documentation

## What This Is

AgentPath is an AI-powered mentorship and opportunity guidance platform for first-generation Nigerian university students. The core product is a conversational AI mentor that helps students discover scholarships, fellowships, and internships — and guides them through applications. The defining design principle is **agency-first**: the AI always asks the student what they think or want before surfacing options. It never leads with lists.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 11 (Node.js) |
| Frontend | Next.js 16 (React 19, App Router) |
| Database | MongoDB via Mongoose (`@nestjs/mongoose`) |
| Auth | JWT — email/password, `httpOnly` cookie + Bearer token |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Package manager | pnpm workspaces (monorepo) |
| Shared types | `packages/shared` (TypeScript interfaces) |

---

## Monorepo Structure

```
AgentPath/
├── backend/                    ← NestJS backend
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── common/         ← filters, interceptors, decorators, guards
│       ├── auth/           ← register, login, JWT strategy
│       ├── users/          ← student profile
│       ├── chat/           ← conversations + messages
│       ├── ai/             ← Claude API integration
│       ├── opportunities/  ← curated opportunity DB
│       └── roadmap/        ← personal milestones
├── frontend/                   ← Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/     ← /login, /register (public routes)
│       │   ├── onboarding/ ← first-time setup wizard
│       │   ├── chat/       ← AI mentor interface (home after login)
│       │   ├── opportunities/
│       │   ├── roadmap/
│       │   └── profile/
│       ├── lib/api/        ← server.ts + client.ts fetch wrappers
│       ├── services/       ← typed API call functions per module
│       ├── components/
│       ├── hooks/
│       └── providers/
├── packages/
│   └── shared/             ← TypeScript types/interfaces shared between backend and frontend
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

---

## Data Models (MongoDB / Mongoose)

### User
```ts
{
  _id: ObjectId
  name: string
  email: string           // unique
  password: string        // argon2 hash
  university: string
  courseOfStudy: string
  yearOfStudy: number     // 1–6
  goals: string[]         // stated by student during onboarding
  isOnboarded: boolean    // false until onboarding wizard is complete
  createdAt: Date
  updatedAt: Date
}
```

### Conversation
```ts
{
  _id: ObjectId
  userId: ObjectId        // ref: User
  title: string           // auto-generated from first message
  createdAt: Date
  updatedAt: Date
}
```

### Message
```ts
{
  _id: ObjectId
  conversationId: ObjectId  // ref: Conversation
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}
```

### Opportunity
```ts
{
  _id: ObjectId
  title: string
  description: string
  type: 'scholarship' | 'fellowship' | 'internship' | 'competition' | 'grant'
  provider: string         // e.g. "John Amhanesi Foundation"
  deadline: Date | null
  eligibility: string      // plain language description
  applicationUrl: string
  tags: string[]           // e.g. ["undergraduate", "engineering", "nigeria"]
  isActive: boolean
  createdAt: Date
}
```

### Roadmap
```ts
{
  _id: ObjectId
  userId: ObjectId          // ref: User (one per user)
  milestones: [
    {
      _id: ObjectId
      title: string
      description: string
      opportunityId: ObjectId | null  // linked opportunity if applicable
      status: 'pending' | 'in_progress' | 'done'
      dueDate: Date | null
      createdAt: Date
    }
  ]
  updatedAt: Date
}
```

---

## API Endpoints

All responses follow the standard envelope:
```json
{ "success": true, "message": "...", "data": {}, "error": null, "timestamp": "..." }
```

Base path: `/api/v1`

### Auth — `@Public()` routes, no JWT required
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create account + return JWT |
| POST | `/auth/login` | Login + return JWT |
| GET | `/auth/me` | Get current authenticated user |

### Users
| Method | Path | Description |
|---|---|---|
| PATCH | `/users/profile` | Update profile fields |
| POST | `/users/onboarding` | Complete onboarding (sets `isOnboarded: true`) |

### Chat
| Method | Path | Description |
|---|---|---|
| GET | `/chat/conversations` | List all conversations for current user |
| POST | `/chat/conversations` | Start a new conversation |
| GET | `/chat/conversations/:id` | Get a conversation + its messages |
| POST | `/chat/conversations/:id/messages` | Send a message — triggers AI response (SSE stream) |
| DELETE | `/chat/conversations/:id` | Delete a conversation |

### Opportunities
| Method | Path | Description |
|---|---|---|
| GET | `/opportunities` | List all active opportunities (supports `?type=`, `?tag=`, `?q=`) |
| GET | `/opportunities/:id` | Get a single opportunity |

### Roadmap
| Method | Path | Description |
|---|---|---|
| GET | `/roadmap` | Get current user's roadmap + milestones |
| POST | `/roadmap/milestones` | Add a milestone |
| PATCH | `/roadmap/milestones/:id` | Update milestone status/details |
| DELETE | `/roadmap/milestones/:id` | Remove a milestone |

---

## Frontend Pages & Routes

| Route | Layout | Auth required |
|---|---|---|
| `/` | None | No |
| `/auth/login` | `(auth)` group — no sidebar | No |
| `/auth/register` | `(auth)` group — no sidebar | No |
| `/onboarding` | None | Yes |
| `/chat` | Sidebar nav | Yes |
| `/chat/:id` | Sidebar nav | Yes |
| `/opportunities` | Sidebar nav | Yes |
| `/opportunities/:id` | Sidebar nav | Yes |
| `/roadmap` | Sidebar nav | Yes |
| `/profile` | Sidebar nav | Yes |

---

## Frontend Flow

### Layout split
The app has two layout zones:
- **Public** — `/`, `/auth/login`, `/auth/register` — no sidebar, no auth check
- **Authenticated** — `/chat`, `/opportunities`, `/roadmap`, `/profile` — wrapped in `chat/layout.tsx` which renders the sidebar nav

The sidebar layout (`src/app/chat/layout.tsx`) is shared across all authenticated sections. It renders the persistent left nav with links to Chat, Opportunities, Roadmap, and Profile.

### Auth & token storage
- On register or login, the API returns `{ user, accessToken }`
- The token is stored in `localStorage` under the key `token`
- `src/lib/api/client.ts` → `clientFetch()` reads the token from `localStorage` and attaches it as `Authorization: Bearer <token>` on every request
- On logout (`/profile` page), `localStorage.removeItem('token')` is called and the user is redirected to `/auth/login`

### Route protection
There is no global middleware guard yet — each authenticated page calls `getMe()` on mount. If the call fails (token missing or expired), the page redirects to `/auth/login`. This is intentional for the initial build — a shared `useAuth` hook or middleware can be added later.

### Onboarding guard
- After registration, the API response includes `user.isOnboarded: false`
- The login page checks `user.isOnboarded` on successful login: if `false` → redirect to `/onboarding`, if `true` → redirect to `/chat`
- The onboarding page calls `POST /users/onboarding` on completion, which sets `isOnboarded: true`, then redirects to `/chat`

### First chat session
- `/chat` loads the conversation list via `GET /chat/conversations`
- If the list is empty, the page shows a "Start your first conversation" CTA which calls `POST /chat/conversations` and redirects to `/chat/:id`
- New conversations start with no messages — the AI does not auto-send an opening message. The UI shows a prompt placeholder: "Say hello to get started."

### AI streaming (SSE)
- When the student sends a message on `/chat/:id`, the frontend calls `POST /chat/conversations/:id/messages`
- The backend streams the AI response as SSE: `data: {"chunk": "..."}` lines, terminated by `data: {"done": true}`
- `src/services/chat.service.ts` → `streamMessage()` reads the SSE stream manually using `fetch` + `ReadableStream`, calling `onChunk(chunk)` per token and `onDone()` when complete
- The UI shows the streaming content with a blinking cursor while streaming is in progress
- The full response is saved to the DB by the backend after streaming completes

### Services layer
Each page imports from `src/services/` — never calls `fetch` directly:
- `auth.service.ts` — register, login, getMe, logout
- `users.service.ts` — updateProfile, completeOnboarding
- `chat.service.ts` — getConversations, createConversation, getConversation, deleteConversation, streamMessage
- `opportunities.service.ts` — getOpportunities (with filters), getOpportunity
- `roadmap.service.ts` — getRoadmap, addMilestone, updateMilestone, deleteMilestone

---

## Core User Flow

```
1. Student lands on /
2. Clicks "Get Started" → /auth/register
3. Registers (name, email, password)
4. Redirected to /onboarding
   Step 1: Confirm name, pick university
   Step 2: Course of study, year of study
   Step 3: "What are you hoping to achieve?" (goals — free text, multi-add)
5. Onboarding complete → POST /users/onboarding → isOnboarded: true
6. Redirected to /chat (home)
7. A new conversation is auto-created on first visit
8. AI opens: "What's on your mind this semester? What are you working towards?"
9. Student responds → AI reflects back, asks a clarifying question
10. AI surfaces relevant opportunities from DB based on the conversation context
11. Student can ask: "Help me write this essay", "What does this require?"
12. AI assists — explains in plain language, drafts content, checks eligibility
13. Student can save milestones to /roadmap as they engage
14. /opportunities is always browseable independently
```

**The AI never leads with a list. It always opens with a question. Agency first.**

---

## AI System Prompt Design

The `ai` module constructs a system prompt per conversation that includes:

1. **Student context** — name, university, course, year, stated goals
2. **Agency-first instruction** — always ask what the student thinks or wants before suggesting; never open with a list of options
3. **Opportunity context** — a summary of available opportunities relevant to the student's profile, injected as knowledge
4. **Tone** — warm, peer-like, not condescending. Explain acronyms. Never assume prior knowledge

The full message history is sent with each request (conversation memory via DB).

---

## Environment Variables

### `backend/.env`
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/agentpath
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start both backend and frontend in parallel
pnpm dev

# Backend only
pnpm dev:backend

# Frontend only
pnpm dev:frontend
```

API runs on `http://localhost:4000/api/v1`
Web runs on `http://localhost:3000`

---

## Module Conventions (Backend)

Following SCMS pattern:
- Every module has: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `schemas/`
- All controllers return `{ data, message }` — the `TransformInterceptor` wraps this into the standard envelope
- All routes are JWT-protected by default via global `JwtAuthGuard`
- Public routes use the `@Public()` decorator
- Current user is accessed via `@CurrentUser()` decorator

---

## Module Conventions (Frontend)

Following upkora-LMS pattern:
- `src/lib/api/server.ts` — server-side fetch (Next.js Server Components, forwards cookies)
- `src/lib/api/client.ts` — client-side API path helper
- `src/services/` — one file per backend module (auth.service.ts, chat.service.ts, etc.) with typed fetch functions
- React Query for client-side data fetching and mutation
- `src/providers/` — wraps the app in QueryProvider
- Middleware forwards `x-pathname` header for server components to know current route
