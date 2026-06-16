# 18 · Interview Questions

A consolidated set of backend interview questions with short answers, grouped by topic.
Each links back to the chapter that explains it in depth.

## Node.js runtime — [01](01-nodejs-runtime.md)

**Is Node single-threaded?** Your JS runs on one main thread; libuv/OS handle I/O
concurrently. → non-blocking, scalable for I/O.

**What is the event loop?** The scheduler that runs sync code, then microtasks (promises),
then macrotasks (timers, I/O), repeatedly.

**Why is blocking the event loop bad?** A long sync task freezes the whole process, so no
other request is served until it finishes.

## TypeScript — [02](02-javascript-typescript.md)

**Do types protect at runtime?** No — they are erased after compilation; use Zod for runtime
checks.

**`unknown` vs `any`?** `any` disables checking; `unknown` forces you to narrow before use.

## HTTP & REST — [03](03-http-and-rest-apis.md)

**`PUT` vs `PATCH`?** `PUT` replaces the whole resource; `PATCH` updates part of it.

**`401` vs `403`?** `401` = not authenticated; `403` = authenticated but not allowed.

**Why `201` and `204`?** `201 Created` after a successful create; `204 No Content` after a
successful delete with no body.

## Express — [04](04-express-fundamentals.md)

**What is middleware?** A `(req, res, next)` function in the request pipeline.

**How is error middleware identified?** By its four parameters `(err, req, res, next)`.

**Why split `app.ts` / `server.ts`?** So Supertest can import the app without binding a
port.

## Architecture — [05](05-project-architecture.md)

**Why controller/service/repository?** Separation of concerns: HTTP, business logic, and
data access change independently and test in isolation.

**Where does business logic go?** In services, not controllers.

## Async — [06](06-async-await-promises-event-loop.md)

**Microtasks vs macrotasks?** Microtasks (promise callbacks) drain before the next
macrotask (timers/I/O).

**Does `await` block?** No — it yields to the event loop.

**Run 3 independent calls efficiently?** `Promise.all([...])`.

## Validation — [07](07-validation-with-zod.md)

**`parse` vs `safeParse`?** `parse` throws; `safeParse` returns a result object.

**Why validate if TypeScript exists?** Types are compile-time only; requests are validated
at runtime with Zod.

## Error handling — [08](08-error-handling.md)

**Why centralize errors?** Consistent responses, no duplicated `try/catch`, one place to log
and control leakage.

**Status for validation failure?** `422` (this project) or `400`.

## Database — [09](09-database-prisma-postgresql.md)

**What is the N+1 problem?** One query for a list plus one per item for relations; fix with
`include`/`select`.

**Why one PrismaClient?** Each client holds a connection pool; many clients exhaust DB
connections.

## Auth — [10](10-authentication-jwt.md) / [11](11-authorization-roles-permissions.md)

**bcrypt vs SHA-256 for passwords?** bcrypt is slow and salted, resisting brute force.

**What is in a JWT?** Header, payload (claims), signature; payload is encoded, not
encrypted.

**Authentication vs authorization?** Who you are vs what you may do.

**What is IDOR?** Accessing another user's resource by changing an ID with no ownership
check.

## Testing — [12](12-testing-jest-supertest.md)

**Unit vs integration?** One function in isolation vs several layers together (e.g. an HTTP
endpoint).

**Why Supertest?** Runs the Express app in-process — fast, no ports.

## Security — [13](13-security-best-practices.md)

**Prevent mass assignment?** Validate and persist only allowed fields, never raw
`req.body`.

**Why hide real error messages in prod?** They leak internals useful to attackers.

## Queues — [14](14-queues-workers-redis.md)

**When to use a queue?** Slow, retriable, or deferrable work (emails, reports, media).

**Why idempotent jobs?** Queues may deliver a job more than once.

## Docker/Prod — [15](15-docker-and-production.md)

**`migrate dev` vs `deploy`?** `dev` is interactive/creates migrations; `deploy` applies
them non-interactively in CI/prod.

**Why handle SIGTERM?** For graceful shutdown during deploys.

## Behavioral / project-based

**Walk me through this Task Manager API.** Layered Express app: routes → controller →
service → repository → Prisma/Postgres, with Zod validation, JWT auth, role + ownership
authorization, centralized errors, and Supertest tests, all containerized via Docker
Compose.

**What would you improve for production?** Add helmet, rate limiting, CORS, refresh tokens,
observability/metrics, and a CI/CD pipeline with `migrate deploy`.
