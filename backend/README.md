# SCMS Backend

NestJS REST + WebSocket API for SCMS, backed by PostgreSQL (Neon) via Prisma.

See [docs/API_REFERENCE.md](../docs/API_REFERENCE.md) for the full endpoint and WebSocket
event reference, and [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for system diagrams.

## Stack

- NestJS 11, bundled with webpack (see `webpack.config.js` and `nest-cli.json`)
- Prisma ORM, client generated into `generated/prisma/` (gitignored, regenerated on install)
- PostgreSQL via Neon
- Passport JWT for auth, argon2 for password hashing
- Socket.IO for the `/parking` and `/alerts` real-time namespaces

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/scms_db
JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Run the initial migration and generate the Prisma client:

```bash
pnpm prisma:migrate
```

Seed the database with sample zones, gates, landmarks, and staff accounts:

```bash
pnpm prisma:seed
```

This prints login credentials for two wardens and an admin to the console.

## Running

```bash
pnpm start:dev     # watch mode
pnpm start         # single run
pnpm start:prod    # runs the built dist/main.js
```

The API listens at `http://localhost:3000/api/v1` (global prefix `api`, URI versioning).

## Tests

```bash
pnpm test
```

## Build

```bash
pnpm build
```

Runs `nest build` (webpack) followed by `tsc-alias`, output to `dist/`.

## Database Scripts

| Script | What it does |
|--------|---------------|
| `pnpm prisma:generate` | Regenerate the Prisma client |
| `pnpm prisma:migrate` | Run `prisma migrate dev` |
| `pnpm prisma:studio` | Open Prisma Studio against the configured `DATABASE_URL` |
| `pnpm prisma:seed` | Wipe and reseed zones, gates, landmarks, and staff accounts |
| `pnpm db:reset` | `prisma migrate reset --force` — drops and recreates the database. Local/dev only. |

## Project Layout

```
src/
├── auth/            # login, me, change-password, JWT strategy + guards
├── users/            # ADMIN-only user CRUD
├── campus/           # public map/zones/gates/landmarks endpoints
├── parking/          # zone status, nearest-zone recommendation, /parking socket gateway
├── alerts/           # broadcast alerts, incidents, warden checkin, /alerts socket gateway
├── recommendations/  # distance + occupancy heuristic scoring (no external ML service)
├── prisma/           # global PrismaModule + PrismaService
└── common/           # decorators, guards, filters, interceptors shared across modules
```

## Key Design Decisions

- Only `WARDEN` and `ADMIN` roles exist. Visitors and drivers are anonymous and never touch
  the auth system.
- There's no public signup. An `ADMIN` provisions warden accounts through `POST /users`.
- Every response is wrapped in `{ success, message, data, error, timestamp }` via a global
  interceptor and exception filter.
- `ADMIN` automatically passes every `@Roles(...)` check, regardless of which role is listed.
- The JWT is returned in the response body as `accessToken`, not a cookie, since the Flutter
  client can't read httpOnly cookies.
