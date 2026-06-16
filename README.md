# Node.js Backend Cheatsheet 🚀

A practical Node.js backend learning repository, built in **small, professional, portfolio-friendly phases**.

> This project grows step by step. You are looking at an early phase — the foundation.
> Each commit leaves the project in a working state.

## Goal

A study guide, cheat sheet, and working API example for learning modern Node.js backend
development with TypeScript. Documentation is in **English** and (in later phases) includes
**Laravel → Node.js** comparisons for developers coming from PHP/Laravel.

## Tech stack (so far)

| Area | Tool |
| --- | --- |
| Runtime | Node.js LTS (20+) |
| Language | TypeScript (strict) |
| Web framework | Express |
| Dev runner | tsx |
| Config | dotenv |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Linting | ESLint |
| Formatting | Prettier |
| Editor config | EditorConfig |

More of the stack (JWT, Jest, Docker production setup, ...) arrives in later phases.

## API (so far)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | — | Health check (`{ "status": "ok" }`) |
| POST | `/auth/register` | — | Register a new user, returns a JWT |
| POST | `/auth/login` | — | Log in, returns a JWT |
| GET | `/auth/me` | ✅ | Current authenticated user |
| GET | `/tasks` | — | List tasks |
| POST | `/tasks` | — | Create a task |
| GET | `/tasks/:id` | — | Get a task |
| PATCH | `/tasks/:id` | — | Update a task |
| PATCH | `/tasks/:id/complete` | — | Mark a task complete |
| DELETE | `/tasks/:id` | — | Delete a task |

Request bodies are validated with **Zod** (invalid input → `422` with field-level errors).
Tasks are now persisted in **PostgreSQL via Prisma**. Ownership/auth arrive in later phases.
Unknown routes return a `404`; typed errors and unexpected `500`s are formatted by the
centralized error middleware.

## Getting started

```bash
npm install
cp .env.example .env

# Start PostgreSQL (and Redis) with Docker
docker compose up -d

# Apply database migrations and seed sample data
npm run prisma:migrate      # or, non-interactively: npm run prisma:deploy
npm run db:seed

# Run the dev server
npm run dev
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Run the server with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled output |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |
| `npm run prisma:migrate` | Create + apply a migration (dev) |
| `npm run prisma:deploy` | Apply migrations (CI/production) |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Seed sample data |

## Project structure (so far)

```text
nodejs-backend-cheatsheet/
├── prisma/
│   ├── schema.prisma     # database models
│   ├── migrations/       # migration history
│   └── seed.ts           # sample data
├── src/
│   ├── app.ts            # builds the Express app (no listening)
│   ├── server.ts         # starts the HTTP server
│   ├── database/         # shared Prisma client
│   ├── modules/          # feature modules (layered)
│   │   └── tasks/        # routes · controller · service · repository · schemas · types
│   ├── middlewares/      # validate · not-found · error
│   └── shared/
│       ├── errors/       # typed AppError hierarchy
│       └── utils/        # asyncHandler
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── .editorconfig
├── .env.example
└── .gitignore
```

## Documentation index

Start at [docs/00-roadmap.md](docs/00-roadmap.md) and work through the chapters in order.

| # | Chapter |
| --- | --- |
| 00 | [Roadmap](docs/00-roadmap.md) |
| 01 | [Node.js runtime](docs/01-nodejs-runtime.md) |
| 02 | [JavaScript & TypeScript](docs/02-javascript-typescript.md) |
| 03 | [HTTP & REST APIs](docs/03-http-and-rest-apis.md) |
| 04 | [Express fundamentals](docs/04-express-fundamentals.md) |
| 05 | [Project architecture](docs/05-project-architecture.md) |
| 06 | [Async/await, promises & the event loop](docs/06-async-await-promises-event-loop.md) |
| 07 | [Validation with Zod](docs/07-validation-with-zod.md) |
| 08 | [Error handling](docs/08-error-handling.md) |
| 09 | [Database: Prisma & PostgreSQL](docs/09-database-prisma-postgresql.md) |
| 10 | [Authentication (JWT)](docs/10-authentication-jwt.md) |
| 11 | [Authorization (roles & permissions)](docs/11-authorization-roles-permissions.md) |
| 12 | [Testing (Jest & Supertest)](docs/12-testing-jest-supertest.md) |
| 13 | [Security best practices](docs/13-security-best-practices.md) |
| 14 | [Queues, workers & Redis](docs/14-queues-workers-redis.md) |
| 15 | [Docker & production](docs/15-docker-and-production.md) |
| 16 | [NestJS overview](docs/16-nestjs-overview.md) |
| 17 | [Laravel → Node.js](docs/17-laravel-to-nodejs.md) |
| 18 | [Interview questions](docs/18-interview-questions.md) |

> Some chapters reference code (`src/`, `prisma/`, `examples/`) that is introduced in
> later phases of this repository.

## Cheatsheets index

- [Node commands](cheatsheets/node-commands.md)
- [Express](cheatsheets/express.md)
- [TypeScript](cheatsheets/typescript.md)
- [Prisma](cheatsheets/prisma.md)
- [Authentication](cheatsheets/authentication.md)
- [Testing](cheatsheets/testing.md)
- [Error handling](cheatsheets/error-handling.md)
- [Production](cheatsheets/production.md)

## Examples

Small, isolated, runnable examples live in [examples/](examples/) — one concept each
(Node core, modules, async/await, HTTP server, Express routes, middleware, error handling,
Zod validation, Prisma CRUD, tests). Run any of them with:

```bash
npx tsx examples/01-node-core/index.ts
```

See [examples/README.md](examples/README.md) for the full list and prerequisites.

## Roadmap

This repository is developed in phases (foundation → Express app → docs → examples →
layered API → validation → Prisma → auth → resources → tests → production → CI/community).

## License

MIT (added with the community files in a later phase).
