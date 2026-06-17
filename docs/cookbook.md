# Feature Cookbook

Task-oriented recipes for "**how do I do X**" in this codebase. Each recipe lists the goal,
the files you touch (in layering order), a short example, and the chapter to read for the
"why".

> The chapters in `docs/` explain **concepts**. This cookbook explains **tasks**. When you
> are building something and just need the steps, start here, then follow the chapter link
> if you want the theory.

## Recipe index

| # | I want to… | Layers touched |
| --- | --- | --- |
| 1 | [Add a field to an existing model](#1-add-a-field-to-an-existing-model) | schema → migration → repo → service → controller → docs → test |
| 2 | [Add an endpoint to an existing module](#2-add-an-endpoint-to-an-existing-module) | routes → controller → service → repo |
| 3 | [Create a brand-new feature module](#3-create-a-brand-new-feature-module) | full module + `app.ts` |
| 4 | [Validate new input with Zod](#4-validate-new-input-with-zod) | `*.schemas.ts` → routes |
| 5 | [Add a relation between models](#5-add-a-relation-between-models) | schema → migration → repo |
| 6 | [Protect a route (auth + ownership)](#6-protect-a-route-auth--ownership) | routes → service |
| 7 | [Add a new role or permission check](#7-add-a-new-role-or-permission-check) | schema → service |
| 8 | [Add pagination, filtering & sorting](#8-add-pagination-filtering--sorting) | schema → controller → service → repo |
| 9 | [Throw a typed error](#9-throw-a-typed-error) | service → `shared/errors` |
| 10 | [Add an environment variable](#10-add-an-environment-variable) | `config/env.ts` → `.env.example` |
| 11 | [Write an integration test](#11-write-an-integration-test) | `src/tests/` |
| 12 | [Document an endpoint in Swagger](#12-document-an-endpoint-in-swagger) | `*.routes.ts` JSDoc |
| 13 | [Hash a password / issue a JWT](#13-hash-a-password--issue-a-jwt) | `shared/utils/` |
| 14 | [Rate-limit a specific route](#14-rate-limit-a-specific-route) | routes |
| 15 | [Run a one-off script or reseed](#15-run-a-one-off-script-or-reseed) | `scripts/`, `prisma/` |

---

## 1. Add a field to an existing model

**Example: add a `priority` field to Task.** (This is also [Lab 01](../labs/01-add-task-priority.md).)

1. **Schema** — edit [prisma/schema.prisma](../prisma/schema.prisma):
   ```prisma
   model Task {
     // ...
     priority Int @default(0)
   }
   ```
2. **Migrate** — `npm run prisma:migrate` (creates and applies a migration).
3. **Validation** — add the field to [tasks.schemas.ts](../src/modules/tasks/tasks.schemas.ts)
   so the API accepts it:
   ```ts
   priority: z.number().int().min(0).max(5).optional(),
   ```
4. **Repository** — the `create`/`update` calls in
   [tasks.repository.ts](../src/modules/tasks/tasks.repository.ts) pass the validated data
   straight through, so often no change is needed. Add the field to `CreateTaskData` if you
   build the object by hand.
5. **Service** — include the field when constructing the create payload in
   [tasks.service.ts](../src/modules/tasks/tasks.service.ts).
6. **Docs** — update the Swagger JSDoc in
   [tasks.routes.ts](../src/modules/tasks/tasks.routes.ts).
7. **Test** — add a happy-path assertion in
   [tasks.test.ts](../src/tests/tasks.test.ts).

> **Read:** [09 · Database](09-database-prisma-postgresql.md), [07 · Validation](07-validation-with-zod.md).

---

## 2. Add an endpoint to an existing module

**Example: `PATCH /tasks/:id/complete`** (already implemented — use it as a template).

1. **Route** — register it in [tasks.routes.ts](../src/modules/tasks/tasks.routes.ts),
   wrapping the controller in `asyncHandler` so thrown errors reach the error middleware:
   ```ts
   router.patch('/:id/complete', asyncHandler(controller.complete));
   ```
2. **Controller** — add a thin HTTP handler in
   [tasks.controller.ts](../src/modules/tasks/tasks.controller.ts) that reads the request,
   calls the service, and sends the response. No business logic here.
3. **Service** — put the logic (and the ownership check) in
   [tasks.service.ts](../src/modules/tasks/tasks.service.ts).
4. **Repository** — add a Prisma call only if you need a new query shape.

> **Read:** [05 · Project architecture](05-project-architecture.md). The golden rule: the
> controller never touches Prisma; only the repository does.

---

## 3. Create a brand-new feature module

Create only the files you need under `src/modules/<name>/` (see the rules in
[CLAUDE.md](../CLAUDE.md)):

```text
<name>.routes.ts       # Express Router
<name>.controller.ts   # HTTP layer (req/res only)
<name>.service.ts      # business logic + authorization
<name>.repository.ts   # the only place that calls prisma.<name>
<name>.schemas.ts      # Zod schemas
<name>.types.ts        # shared types
```

Then wire the router into [src/app.ts](../src/app.ts):
```ts
import { commentsRouter } from './modules/comments/comments.routes.js';
app.use('/comments', commentsRouter);
```

Copy the `tasks` module as your reference implementation — it shows every layer.

> **Read:** [05 · Project architecture](05-project-architecture.md).

---

## 4. Validate new input with Zod

Define the schema in `*.schemas.ts` and attach the `validate` middleware in the route. Never
validate by hand in a controller.

```ts
// users.schemas.ts
export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
```
```ts
// users.routes.ts
router.post('/', validate(createUserSchema), asyncHandler(controller.create));
```

The [validate middleware](../src/middlewares/validate.middleware.ts) parses `req.body`,
replaces it with the typed/cleaned result, and rejects invalid input with a **422** (the
error middleware maps Zod errors to 422) before your controller runs. For query strings
(`?page=2`), use the `validateQuery` sibling with a `z.coerce`-based schema. Infer the
TypeScript type from the schema with `z.infer` so the schema is the single source of truth.

> **Read:** [07 · Validation with Zod](07-validation-with-zod.md).

---

## 5. Add a relation between models

In [prisma/schema.prisma](../prisma/schema.prisma), add the foreign key + relation on both
sides, then migrate:

```prisma
model Task {
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
  @@index([projectId])     // index foreign keys you filter/join on
}
```

- Pick an `onDelete` behavior deliberately (`Cascade`, `SetNull`, `Restrict`).
- Add `@@index` on columns you filter or join by — this is the cheapest performance win.
- In the repository, use `include` or `select` to fetch related rows, and watch for the
  **N+1 problem** (see [19 · Performance & data access](19-performance-and-data-access.md)).

> **Read:** [09 · Database](09-database-prisma-postgresql.md).

---

## 6. Protect a route (auth + ownership)

Two layers of protection:

1. **Authentication** — require a valid JWT by mounting the
   [auth middleware](../src/middlewares/auth.middleware.ts) on the router:
   ```ts
   router.use(authenticate); // every route below now needs a Bearer token
   ```
2. **Ownership** — check in the *service*, not the route, that the actor owns the resource.
   See `getOwnedTask` in [tasks.service.ts](../src/modules/tasks/tasks.service.ts):
   ```ts
   if (task.ownerId !== actor.id && actor.role !== 'ADMIN') {
     throw new ForbiddenError();
   }
   ```

Skipping the ownership check is the **IDOR** vulnerability (user A reads user B's data by
guessing an id). Authentication alone does not prevent it.

> **Read:** [11 · Authorization](11-authorization-roles-permissions.md), [13 · Security](13-security-best-practices.md).

---

## 7. Add a new role or permission check

1. Add the value to the `Role` enum in [prisma/schema.prisma](../prisma/schema.prisma) and
   migrate.
2. Gate behavior in the service:
   ```ts
   if (actor.role !== 'ADMIN') throw new ForbiddenError();
   ```
3. For route-level role gates, add a small guard middleware (e.g. `requireRole('ADMIN')`)
   rather than repeating the check in every handler once it appears in 3+ places.

> **Read:** [11 · Authorization](11-authorization-roles-permissions.md).

---

## 8. Add pagination, filtering & sorting

Implemented on `GET /tasks`, `GET /projects`, and `GET /users` — all sharing one helper in
[src/shared/utils/pagination.ts](../src/shared/utils/pagination.ts). The pattern: extend the
shared `paginationSchema` with your filters/sort, validate with `validateQuery`, and let the
service build the Prisma query and the envelope.

```ts
// tasks.schemas.ts — extend the shared schema; add only what is module-specific
import { paginationSchema } from '../../shared/utils/pagination.js';

export const listTasksQuerySchema = paginationSchema.extend({
  status: taskStatusSchema.optional(),
  sort: z.enum(['createdAt', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
```
```ts
// service — reuse toSkipTake + toPage so every endpoint returns the same envelope
const result = await tasksRepository.list({ where, orderBy: { [q.sort]: q.order }, ...toSkipTake(q) });
return toPage(result, q);
```
```ts
// repository — skip/take is offset pagination
prisma.task.findMany({
  where: { ownerId, ...(status ? { status } : {}) },
  orderBy: { [sort]: order },
  skip: (page - 1) * limit,
  take: limit,
});
```

Return a consistent envelope (`{ data, page, limit, total }`) so clients can paginate.
Always cap `limit` to protect the database.

> **Read:** [20 · API design at scale](20-api-design-at-scale.md).

---

## 9. Throw a typed error

Throw an error from `src/shared/errors/` in the **service**. Never build an error response
in a service — only the [error middleware](../src/middlewares/error.middleware.ts) formats
responses.

```ts
import { NotFoundError } from '../../shared/errors/index.js';
if (!task) throw new NotFoundError('Task not found');
```

Because controllers are wrapped in [asyncHandler](../src/shared/utils/async-handler.ts), the
thrown error is caught and forwarded to the error middleware, which maps it to the right
status code and JSON shape. To add a new error type, extend the base error in
[shared/errors/index.ts](../src/shared/errors/index.ts).

> **Read:** [08 · Error handling](08-error-handling.md).

---

## 10. Add an environment variable

1. Add it to the Zod schema in [src/config/env.ts](../src/config/env.ts) so the app
   **refuses to boot** with an invalid value:
   ```ts
   REDIS_URL: z.string().url(),
   ```
2. Document it in [.env.example](../.env.example) (and `.env.test` if tests need it).
3. Read it through the typed `env` object — never `process.env.FOO` directly elsewhere.

> **Read:** [13 · Security](13-security-best-practices.md), [22 · Configuration & secrets](22-configuration-and-secrets.md).

---

## 11. Write an integration test

Use Supertest against the imported `app` (no running server needed — that is why
[app.ts](../src/app.ts) and `server.ts` are split). Each new endpoint gets at least one
happy path and one failure path.

```ts
import request from 'supertest';
import { app } from '../app.js';

it('rejects unauthenticated access', async () => {
  const res = await request(app).get('/tasks');
  expect(res.status).toBe(401);
});
```

See [tasks.test.ts](../src/tests/tasks.test.ts) and the shared
[helpers.ts](../src/tests/helpers.ts) (which create a user and return a token). Run with
`npm test` after `npm run db:test:setup`.

> **Read:** [12 · Testing](12-testing-jest-supertest.md).

---

## 12. Document an endpoint in Swagger

This project keeps the whole OpenAPI spec in one **central definition object** in
[src/config/swagger.ts](../src/config/swagger.ts) (it calls `swaggerJSDoc` with `apis: []`,
so it does **not** scan JSDoc comments). To document a new endpoint, add an entry under
`paths` and reuse the shared `components.schemas` / `components.responses`:

```ts
'/tasks/{id}/complete': {
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
  patch: {
    tags: ['Tasks'],
    summary: 'Mark a task complete (owner or admin)',
    responses: {
      200: { description: 'Task marked as DONE',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
      401: { $ref: '#/components/responses/Unauthorized' },
      404: { $ref: '#/components/responses/NotFound' },
    },
  },
},
```

Document the auth requirement and the error responses, not just the happy path. The spec is
served at `/api-docs`. If you add a new response shape (e.g. a paginated list), add a schema
to `components.schemas` and `$ref` it — see `PaginatedTasks`.

---

## 13. Hash a password / issue a JWT

Reuse the shared utilities — do not reinvent crypto.

```ts
import { hashPassword, verifyPassword } from '../../shared/utils/password.js';
import { signToken, verifyToken } from '../../shared/utils/jwt.js';

const passwordHash = await hashPassword(input.password);  // bcrypt
const token = signToken({ sub: user.id, role: user.role }); // signed with JWT_SECRET
```

Never store plaintext passwords; never put secrets in the token payload (it is readable,
just signed). See [shared/utils/password.ts](../src/shared/utils/password.ts) and
[shared/utils/jwt.ts](../src/shared/utils/jwt.ts).

> **Read:** [10 · Authentication](10-authentication-jwt.md).

---

## 14. Rate-limit a specific route

A global limiter is already mounted in [app.ts](../src/app.ts). To apply a *stricter* limit
to a sensitive route (e.g. login), mount a dedicated limiter on just that route:

```ts
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 });
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(controller.login));
```

Tighter limits on auth endpoints slow down credential-stuffing and brute-force attacks.

> **Read:** [13 · Security](13-security-best-practices.md), [21 · Reliability & resilience](21-reliability-and-resilience.md).

---

## 15. Run a one-off script or reseed

- **Reseed the dev database:** `npm run db:seed` (logic in
  [prisma/seed.ts](../prisma/seed.ts)).
- **One-off scripts:** add a file under [scripts/](../scripts/) and run it with `tsx`. Import
  the typed `env` and the Prisma client the same way the app does, so scripts share the same
  config and connection rules.
- **Reset everything:** `docker compose down -v` wipes the database; then rerun
  `npm run prisma:migrate` and `npm run db:seed`.

> **Read:** [09 · Database](09-database-prisma-postgresql.md), [15 · Docker & production](15-docker-and-production.md).

---

## See also

- [learning-index.md](learning-index.md) — concept-to-source map.
- [study-guide.md](study-guide.md) — pick a learning track.
- [labs/README.md](../labs/README.md) — practice by changing the real API.
</content>
</invoke>
