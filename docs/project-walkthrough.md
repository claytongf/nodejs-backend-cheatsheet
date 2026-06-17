# Project Walkthrough Scripts

Use these scripts to practice explaining the project. Do not memorize them word-for-word;
use them as structure.

## Two-Minute Recruiter Version

This is a Node.js backend learning and portfolio project built around a Task Manager API.
It uses TypeScript, Express, Prisma, PostgreSQL, JWT authentication, Zod validation,
integration tests, Swagger docs, Docker, and CI.

The goal was to build something practical enough to discuss in interviews, not just a
small isolated tutorial. The API has users, projects, and tasks. It includes role-based
authorization for admins and ownership checks so users can only access their own projects
and tasks.

I also built learning material around it: docs, cheatsheets, runnable examples, labs, and
interview-preparation prompts. So the project works both as a backend reference and as a
tool for preparing for job interviews.

## Five-Minute Engineer Version

The API is organized as a layered Express application. `app.ts` configures middleware and
routes, while `server.ts` starts the HTTP listener. That split lets Supertest import the
app without binding a real port.

Each feature lives in `src/modules/`. Routes attach middleware, controllers handle HTTP,
services hold business logic and authorization, repositories access Prisma, and schemas
validate input with Zod.

The data model has users, projects, and tasks. Projects belong to users, tasks belong to
projects and owners, and the service layer checks ownership before returning or changing
resources. Admins can access broader data where the route allows it.

Authentication uses bcrypt for password hashing and JWT for access tokens. The middleware
verifies the token and attaches the authenticated user to the request. Authorization is
then enforced in services, especially for owner/admin checks.

Testing uses Jest and Supertest. Tests run against a separate test database and cover
registration, login, current user, protected routes, validation failures, and ownership
rules.

For production-style concerns, the project includes helmet, CORS, rate limiting,
structured logging, environment validation, Docker Compose, Swagger, and CI migrations.
If I were extending it further, I would add refresh tokens, request IDs, metrics/tracing,
stricter production CORS, readiness checks, and pagination.

## Deep Technical Version

Start with the request lifecycle:

1. A request enters Express through `src/app.ts`.
2. Global middleware applies security headers, CORS, JSON parsing, logging, and rate
   limiting.
3. The request reaches a feature router.
4. Protected routers use auth middleware to verify the JWT.
5. Validation middleware parses incoming bodies with Zod.
6. Controllers translate HTTP input into service calls.
7. Services enforce business rules and authorization.
8. Repositories execute Prisma queries.
9. Errors flow to centralized error middleware.

Then show one endpoint:

- `POST /tasks`
- Requires authentication.
- Validates title, description, project ID, and optional status.
- Loads the target project.
- Verifies the actor owns the project or is an admin.
- Creates the task with the authenticated user as owner.
- Returns `201`.

Then explain testing:

- Supertest imports the app directly.
- Tests reset database state between cases.
- Auth helpers register and log in users.
- Tests assert success paths and failure paths such as `401`, `403`, and `422`.

Then explain trade-offs:

- Layering adds files, but it makes auth and ownership easier to reason about.
- JWT is simple and scalable, but refresh-token/revocation support would improve long
  sessions.
- Docker Compose is enough for local dependencies, but deployment would need environment-
  specific configuration and observability.

## Questions to Be Ready For

- Why not put Prisma calls directly in controllers?
- Why use Zod if TypeScript already exists?
- How do you prevent users from accessing other users' tasks?
- How would you add pagination?
- How would you deploy this?
- What is missing before production?
- Which part was hardest to build?
