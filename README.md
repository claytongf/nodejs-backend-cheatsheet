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
| Linting | ESLint |
| Formatting | Prettier |
| Editor config | EditorConfig |

More of the stack (Prisma, PostgreSQL, Zod, JWT, Jest, Docker, ...) arrives in later phases.

## API (so far)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check (`{ "status": "ok" }`) |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Get a task |
| PATCH | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/complete` | Mark a task complete |
| DELETE | `/tasks/:id` | Delete a task |

Tasks currently use an **in-memory** store; they gain real persistence (Prisma + PostgreSQL),
validation (Zod), and ownership/auth in later phases. Unknown routes return a `404`; typed
errors (`400`/`404`) and unexpected `500`s are formatted by the centralized error middleware.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Run the entry point with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled output |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |

## Project structure (so far)

```text
nodejs-backend-cheatsheet/
├── src/
│   ├── app.ts            # builds the Express app (no listening)
│   ├── server.ts         # starts the HTTP server
│   ├── modules/          # feature modules (layered)
│   │   └── tasks/        # routes · controller · service · repository · types
│   ├── middlewares/
│   │   ├── not-found.middleware.ts
│   │   └── error.middleware.ts
│   └── shared/
│       └── errors/       # typed AppError hierarchy
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
