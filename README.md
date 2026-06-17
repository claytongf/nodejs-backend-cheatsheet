# Node.js Backend Cheatsheet 🚀

A practical, well-documented Node.js backend learning repository — built as a **study guide**, a **cheat sheet**, a **working API example**, and a **portfolio project** all at once.

![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?logo=jest&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> **All content is in English** and includes **Laravel → Node.js** comparisons, because many backend developers arrive here from PHP/Laravel.

---

## 📖 Short description

This repository teaches modern Node.js backend development by building a real **Task Manager API** with TypeScript, Express, Prisma, PostgreSQL, JWT authentication, Zod validation, role-based authorization, tests, and Docker — and documents every concept along the way.

## 🎯 Why this project exists

Most tutorials show you _one_ piece in isolation. Real backend work means wiring **all** the pieces together: routing, validation, auth, database access, error handling, testing, and deployment. This repo:

- Gives you **runnable, isolated examples** for each concept.
- Gives you a **production-style API** that ties everything together.
- Gives you **cheat sheets** for quick recall.
- Gives you **interview prep** and a **study roadmap**.

## 👥 Who this project is for

- Developers learning **Node.js backend** from scratch (beginner → intermediate).
- **PHP/Laravel developers** moving to the Node.js ecosystem.
- People preparing for **backend interviews**.
- Anyone who wants a **clean reference architecture** to copy from.

## 🧰 Tech stack

| Area          | Tool                                            |
| ------------- | ----------------------------------------------- |
| Runtime       | Node.js LTS                                     |
| Language      | TypeScript (strict)                             |
| Web framework | Express                                         |
| ORM           | Prisma                                          |
| Database      | PostgreSQL                                      |
| Validation    | Zod                                             |
| Auth          | JWT + bcrypt                                    |
| API docs      | Swagger UI (swagger-ui-express + swagger-jsdoc) |
| Logging       | pino                                            |
| Testing       | Jest + Supertest                                |
| Tooling       | ESLint, Prettier, tsx, dotenv                   |
| Infra         | Docker, Docker Compose (PostgreSQL + Redis)     |

## 🎓 What you will learn

- How the Node.js runtime and event loop actually work.
- TypeScript for backend code (strict mode, types, generics).
- Designing REST APIs and an Express project architecture.
- Input validation with Zod and centralized error handling.
- Database modeling and access with Prisma + PostgreSQL.
- Authentication (JWT), password hashing (bcrypt), and authorization (roles + ownership).
- Writing integration tests with Jest and Supertest.
- Security best practices and production/Docker concerns.
- How all of this maps back to **Laravel** concepts.

## 🗂️ Project structure

```
nodejs-backend-cheatsheet/
├── README.md                 # You are here
├── CLAUDE.md                 # Guidance for AI agents working on this repo
├── docs/                     # Deep-dive learning chapters (00–18)
├── cheatsheets/              # Quick-scan reference sheets
├── examples/                 # Small, isolated, runnable examples
├── labs/                     # Practical implementation and debugging labs
├── scripts/                  # Local project utilities
├── prisma.config.ts          # Prisma 7 config (schema path, migrate URL, seed)
├── prisma/                   # Prisma schema + seed
├── src/                      # The Task Manager API
│   ├── app.ts                # Express app (no listen)
│   ├── server.ts             # Boots the HTTP server
│   ├── config/               # env, logger, swagger (OpenAPI spec)
│   ├── database/             # Prisma client
│   ├── web/                  # minimal landing page (GET /)
│   ├── middlewares/          # auth, error, validate, not-found
│   ├── modules/              # auth, users, projects, tasks
│   ├── shared/               # errors, utils, types
│   └── tests/                # integration tests
├── docker-compose.yml
└── .github/                  # CI + issue/PR templates
```

## 🚀 Getting started

### Prerequisites

- Node.js **20+** (LTS)
- Docker + Docker Compose
- npm (ships with Node)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment

```bash
cp .env.example .env
# edit .env if needed
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations and seed

```bash
npm run prisma:migrate
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
# API on http://localhost:3000
```

## 🔐 Environment variables

| Variable         | Description                       | Example                                                                   |
| ---------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `NODE_ENV`       | Runtime environment               | `development`                                                             |
| `PORT`           | HTTP port                         | `3000`                                                                    |
| `LOG_LEVEL`      | pino log level                    | `info`                                                                    |
| `DATABASE_URL`   | PostgreSQL connection string      | `postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public` |
| `JWT_SECRET`     | Secret used to sign JWTs          | `a-long-random-string`                                                    |
| `JWT_EXPIRES_IN` | Token lifetime                    | `1d`                                                                      |
| `REDIS_URL`      | Redis connection (queues chapter) | `redis://localhost:6379`                                                  |

See [.env.example](.env.example) for the full list. Validation happens at startup in [src/config/env.ts](src/config/env.ts) — the app **refuses to boot** with an invalid config.

## 🐳 Running with Docker

```bash
docker compose up -d        # start PostgreSQL + Redis
docker compose ps           # check status
docker compose logs -f      # follow logs
docker compose down         # stop
docker compose down -v      # stop and wipe data
```

## 💻 Running locally

```bash
npm run dev          # hot-reload dev server (tsx)
npm run build        # compile TypeScript to dist/
npm start            # run the compiled build
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # type-check without emitting
```

## 🧪 Running tests

The test suite uses `.env.test` and a separate PostgreSQL database named
`taskmanager_test`, so test data never touches your development data.

```bash
npm run db:test:setup # create the test DB if needed and apply migrations
npm test             # run all tests (Jest + Supertest)
npm run test:watch   # watch mode
```

If you reset Docker volumes with `docker compose down -v`, run `npm run db:test:setup`
again before running the tests.

## ✅ Validation checklist

Before committing a change, run:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

For dependency security checks, run:

```bash
npm audit --audit-level=moderate
```

## 🔌 API endpoints

| Method | Path                  | Auth     | Description                    |
| ------ | --------------------- | -------- | ------------------------------ |
| GET    | `/health`             | —        | Health check                   |
| POST   | `/auth/register`      | —        | Register a new user            |
| POST   | `/auth/login`         | —        | Log in, returns a JWT          |
| GET    | `/auth/me`            | ✅       | Current authenticated user     |
| GET    | `/users`              | ✅ admin | List users                     |
| GET    | `/users/:id`          | ✅       | Get a user                     |
| PATCH  | `/users/:id`          | ✅       | Update a user (self or admin)  |
| DELETE | `/users/:id`          | ✅ admin | Delete a user                  |
| POST   | `/projects`           | ✅       | Create a project               |
| GET    | `/projects`           | ✅       | List your projects             |
| GET    | `/projects/:id`       | ✅       | Get a project (owner/admin)    |
| PATCH  | `/projects/:id`       | ✅       | Update a project (owner/admin) |
| DELETE | `/projects/:id`       | ✅       | Delete a project (owner/admin) |
| POST   | `/tasks`              | ✅       | Create a task                  |
| GET    | `/tasks`              | ✅       | List your tasks                |
| GET    | `/tasks/:id`          | ✅       | Get a task (owner/admin)       |
| PATCH  | `/tasks/:id`          | ✅       | Update a task (owner/admin)    |
| DELETE | `/tasks/:id`          | ✅       | Delete a task (owner/admin)    |
| PATCH  | `/tasks/:id/complete` | ✅       | Mark a task complete           |

## 🌐 Browser interfaces

This is a backend project, so the browser surface is intentionally minimal — just enough
to explore the API. With the server running (`npm run dev`):

| Interface     | URL / command                    | What it is                                         |
| ------------- | -------------------------------- | -------------------------------------------------- |
| Landing page  | <http://localhost:3000/>         | A static page describing the project with links    |
| API docs      | <http://localhost:3000/api-docs> | Interactive Swagger UI (OpenAPI) for all endpoints |
| Health check  | <http://localhost:3000/health>   | Liveness probe (`{ "status": "ok" }`)              |
| Prisma Studio | `npm run prisma:studio`          | Visual database browser (opens in your browser)    |

The Swagger UI documents Auth, Users, Projects, and Tasks with request/response examples,
error responses, and **Bearer token** auth — click **Authorize** and paste a JWT from
`POST /auth/login` to try protected endpoints directly from the browser.

## 🗺️ Learning roadmap

Start at [docs/00-roadmap.md](docs/00-roadmap.md) for the full chapter order. If you want
a path tailored to your background or goal, use [docs/study-guide.md](docs/study-guide.md).
Each chapter has a study checklist and interview questions.

For hands-on practice, use [labs/README.md](labs/README.md). Labs ask you to change the
real API, update tests, and explain the trade-offs.

For interview practice, use [interview-prep/README.md](interview-prep/README.md). It
includes question banks, mock interviews, coding prompts, debugging drills, system design
prompts, behavioral prep, and scoring rubrics.

For portfolio preparation, use [docs/portfolio-guide.md](docs/portfolio-guide.md) and
[docs/project-walkthrough.md](docs/project-walkthrough.md).

## 📚 Documentation index

| #   | Chapter                                                                              |
| --- | ------------------------------------------------------------------------------------ |
| 00  | [Roadmap](docs/00-roadmap.md)                                                        |
| 01  | [Node.js runtime](docs/01-nodejs-runtime.md)                                         |
| 02  | [JavaScript & TypeScript](docs/02-javascript-typescript.md)                          |
| 03  | [HTTP & REST APIs](docs/03-http-and-rest-apis.md)                                    |
| 04  | [Express fundamentals](docs/04-express-fundamentals.md)                              |
| 05  | [Project architecture](docs/05-project-architecture.md)                              |
| 06  | [Async/await, promises & the event loop](docs/06-async-await-promises-event-loop.md) |
| 07  | [Validation with Zod](docs/07-validation-with-zod.md)                                |
| 08  | [Error handling](docs/08-error-handling.md)                                          |
| 09  | [Database: Prisma & PostgreSQL](docs/09-database-prisma-postgresql.md)               |
| 10  | [Authentication (JWT)](docs/10-authentication-jwt.md)                                |
| 11  | [Authorization (roles & permissions)](docs/11-authorization-roles-permissions.md)    |
| 12  | [Testing (Jest & Supertest)](docs/12-testing-jest-supertest.md)                      |
| 13  | [Security best practices](docs/13-security-best-practices.md)                        |
| 14  | [Queues, workers & Redis](docs/14-queues-workers-redis.md)                           |
| 15  | [Docker & production](docs/15-docker-and-production.md)                              |
| 16  | [NestJS overview](docs/16-nestjs-overview.md)                                        |
| 17  | [Laravel → Node.js](docs/17-laravel-to-nodejs.md)                                    |
| 18  | [Interview questions](docs/18-interview-questions.md)                                |

## ⚡ Cheatsheets index

- [Node commands](cheatsheets/node-commands.md)
- [Express](cheatsheets/express.md)
- [TypeScript](cheatsheets/typescript.md)
- [Prisma](cheatsheets/prisma.md)
- [Authentication](cheatsheets/authentication.md)
- [Testing](cheatsheets/testing.md)
- [Error handling](cheatsheets/error-handling.md)
- [Production](cheatsheets/production.md)

## 🔄 Laravel to Node.js comparison

| Laravel                            | Node.js (this project)                   |
| ---------------------------------- | ---------------------------------------- |
| `routes/web.php`, `routes/api.php` | Express `Router` in `*.routes.ts`        |
| Controllers                        | `*.controller.ts`                        |
| Eloquent Models                    | Prisma models + `*.repository.ts`        |
| Form Requests                      | Zod schemas in `*.schemas.ts`            |
| Middleware                         | Express middleware in `src/middlewares/` |
| Service Container / DI             | Plain imports & factory functions        |
| `php artisan migrate`              | `npm run prisma:migrate`                 |
| `php artisan tinker`               | `npm run prisma:studio`                  |
| Sanctum / Passport                 | JWT + bcrypt                             |
| Gates / Policies                   | Role + ownership checks                  |
| PHPUnit / Pest                     | Jest + Supertest                         |

Full chapter: [docs/17-laravel-to-nodejs.md](docs/17-laravel-to-nodejs.md).

## 🎤 Interview preparation

Every doc chapter ends with interview questions and short answers. A consolidated set lives in [docs/18-interview-questions.md](docs/18-interview-questions.md).

## 🤝 Contributing

Contributions are welcome — docs, examples, tests, bug fixes, and cheat sheets. Read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

Licensed under the [MIT License](LICENSE).
