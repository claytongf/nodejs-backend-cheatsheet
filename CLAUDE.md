# CLAUDE.md — Guidance for AI agents

This file tells future AI agents (and humans) how to work on this repository **without breaking its purpose**.

## Project purpose

This is a **learning repository**, not a startup codebase. It must stay:

- **Beginner-friendly** — readable by someone with ~6 months of programming experience.
- **Well-documented** — every concept has docs, a cheat sheet, and/or an example.
- **Consistent** — the Task Manager API is the reference implementation.
- **In English** — all docs, comments, commit messages, and identifiers.

If a change makes the code shorter but harder to understand, **do not make it**.

## Architecture rules

- The API lives in `src/` and follows a **layered, modular** structure:
  `routes → controller → service → repository → Prisma`.
- `app.ts` builds the Express app (no `listen`). `server.ts` starts it. This split exists so tests can import the app with Supertest.
- Each feature is a **module** under `src/modules/<name>/`.
- Cross-cutting concerns live in `src/middlewares/` and `src/shared/`.
- **Controllers** handle HTTP (req/res). **Services** hold business logic. **Repositories** are the only place that touches Prisma.
- Never call `prisma` directly from a controller.

## Naming conventions

- Files: `kebab-case` with a role suffix — `tasks.controller.ts`, `tasks.service.ts`.
- Classes/Types: `PascalCase`. Variables/functions: `camelCase`.
- Zod schemas: `createTaskSchema`, `updateTaskSchema`.
- Custom errors: `NotFoundError`, `UnauthorizedError`, etc.
- Routes use plural nouns: `/tasks`, `/projects`.

## Documentation standards

- Every `docs/*.md` chapter must include, in this order:
  1. Clear explanation of the concept
  2. Why it matters in backend development
  3. How it appears in real Node.js jobs
  4. A simple code example
  5. A practical example from this project (when possible)
  6. Laravel comparison (when relevant)
  7. Common beginner mistakes
  8. Best practices
  9. Study checklist
  10. Interview questions with short answers
- **No empty or placeholder-only files.** Every file ships with useful content.
- Link to real files using relative paths.

## Testing standards

- Use **Jest + Supertest** for integration tests under `src/tests/`.
- Test the public HTTP behavior, not private functions.
- Each new endpoint should get at least one happy-path and one failure-path test.
- Tests must be runnable with `npm test` and not depend on external state beyond the test DB.

## Module creation rules

When adding a feature module, create only the files you need from:

```
<name>.routes.ts       # Express Router
<name>.controller.ts   # HTTP layer
<name>.service.ts      # business logic
<name>.repository.ts   # Prisma access
<name>.schemas.ts      # Zod schemas
<name>.types.ts        # shared types
```

Wire the router into `src/app.ts`. Keep the layering intact.

## Error handling rules

- Throw typed errors from `src/shared/errors/` (e.g. `throw new NotFoundError('Task not found')`).
- Never send error responses from a service. Only the **error middleware** formats responses.
- Wrap async controllers so thrown errors reach the error middleware (see `asyncHandler`).

## Validation rules

- Validate **all** external input with Zod in `*.schemas.ts`.
- Use the `validate` middleware; do not validate by hand in controllers.
- Parse/transform with Zod so the rest of the code receives typed, clean data.

## How to keep the project beginner-friendly

- Prefer explicit code over clever one-liners.
- Add short comments that explain **why**, not **what**.
- Keep functions small and single-purpose.
- When introducing a pattern, link to the doc chapter that explains it.

## How to avoid overengineering

- **No** dependency-injection frameworks, decorators, or magic.
- **No** premature abstractions — duplicate twice before extracting.
- **No** new dependencies unless a doc chapter justifies them.
- Keep the dependency list close to what `README.md` advertises.
