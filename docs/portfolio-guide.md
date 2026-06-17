# Portfolio Guide

This project can be presented as more than a tutorial. It is a working backend API with
documentation, tests, validation, authentication, authorization, database migrations,
Swagger, Docker, and CI.

## How to Position the Project

Use this framing:

> I built a Task Manager API to demonstrate production-style Node.js backend fundamentals:
> layered Express architecture, TypeScript, Prisma/PostgreSQL, Zod validation, JWT auth,
> role and ownership authorization, integration tests, Swagger docs, Docker, and CI.

Avoid this framing:

> It is just a cheatsheet or a tutorial repo.

The value is that the repo teaches the concepts and also implements them in a real API.

## What to Show First

1. README: explain the purpose and stack.
2. Swagger at `/api-docs`: show the API surface.
3. `src/app.ts`: show middleware and route wiring.
4. One module, such as `src/modules/tasks/`: show layered structure.
5. `prisma/schema.prisma`: show database modeling.
6. `src/tests/`: show integration testing.
7. `docs/`, `labs/`, and `interview-prep/`: show the learning system.

## Architecture Talking Points

- `app.ts` builds the Express app; `server.ts` starts the listener.
- Modules are organized by feature.
- Controllers handle HTTP.
- Services own business logic and authorization.
- Repositories are the only layer that touches Prisma.
- Zod schemas validate runtime input.
- Centralized errors keep responses consistent.

## Security Talking Points

- Passwords are hashed with bcrypt.
- JWTs identify authenticated users.
- Role checks protect admin-only routes.
- Ownership checks protect projects and tasks from IDOR.
- Helmet, CORS, rate limiting, and environment validation are included.
- Production hardening would still need stricter CORS, metrics/tracing, request IDs, secret
  rotation, backups, and deployment-specific readiness checks.

## Testing Talking Points

- Supertest exercises the Express app in-process.
- The test database is separate from the development database.
- Tests cover auth, validation, ownership, and health checks.
- `app.ts` and `server.ts` are split so tests do not need a real port.

## Database Talking Points

- Prisma models describe users, projects, and tasks.
- Migrations version schema changes.
- Relations and indexes support ownership queries.
- The test setup mirrors CI by applying migrations to `taskmanager_test`.

## What to Say When Asked "What Would You Improve?"

Give a prioritized answer:

1. Add refresh tokens and token revocation for longer sessions.
2. Add request IDs, metrics, and tracing.
3. Add stricter production CORS configuration.
4. Add readiness checks that verify database connectivity.
5. Add pagination and filtering to list endpoints.
6. Add a deployment target and backup strategy.

Good answer signal: mention what already exists before listing what is missing.

## Optional Portfolio Extensions

Choose one or two. Do not add every possible feature.

- Task priority and due dates.
- Task filters and pagination.
- Refresh tokens.
- Workspace/team collaboration.
- Audit logs.
- Request IDs and structured request tracing.
- Readiness checks.
- CI link validation for docs.

## Common Mistakes When Presenting

- Saying "I used JWT" without explaining revocation trade-offs.
- Showing only code and not tests.
- Talking about folder structure without explaining why it helps.
- Listing production features that already exist as future improvements.
- Overclaiming: this is production-style, not a complete production platform.
