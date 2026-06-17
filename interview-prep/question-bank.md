# Question Bank

Questions are grouped by topic and level. A strong answer should be clear, concrete, and
connected to real project files.

## Node.js Runtime

### Junior

**Q: Is Node.js single-threaded?**
A: JavaScript runs on one main thread, while libuv and the operating system handle many
I/O operations concurrently.

Strong answer signals:

- Mentions the event loop.
- Distinguishes JavaScript execution from I/O handling.
- Explains why blocking CPU work hurts all requests.

### Mid-Level

**Q: What happens when an Express route awaits a database query?**
A: The request handler yields while the database work is pending. Node can continue
processing other events, then resumes the handler when the promise resolves.

Strong answer signals:

- Explains `await` without saying it blocks the whole process.
- Connects the answer to Prisma calls in repositories.

### Senior

**Q: A single endpoint makes the whole service slow for everyone. What is happening and how do you fix it?**
A: Likely synchronous CPU work (a big loop, JSON crunching, crypto) blocking the event
loop, so no other request can be served. Move it off the main thread: a worker thread, a
queue/worker process, or a faster algorithm. Confirm with event-loop lag metrics.

Strong answer signals:

- Names the event loop as the shared resource.
- Distinguishes CPU-bound from I/O-bound work.
- Mentions worker threads / queues (see [14 · Queues](../docs/14-queues-workers-redis.md)).

## HTTP and REST

### Junior

**Q: What is the difference between `401` and `403`?**
A: `401` means the caller is not authenticated. `403` means the caller is authenticated
but not allowed to perform the action.

Strong answer signals:

- Points to auth middleware for `401`.
- Points to service ownership checks for `403`.

### Mid-Level

**Q: Why should validation happen before business logic?**
A: The service layer should receive clean, expected data. Validation rejects malformed
input early, prevents mass assignment, and gives clients consistent errors.

Strong answer signals:

- Mentions Zod schemas.
- Mentions `422` responses.
- Explains that TypeScript does not validate runtime requests.

## Architecture

### Junior

**Q: Why split routes, controllers, services, and repositories?**
A: Each layer has one responsibility: routes map URLs, controllers handle HTTP, services
apply business rules, and repositories access the database.

Strong answer signals:

- Can trace one endpoint through the files.
- Explains why controllers should stay thin.

### Mid-Level

**Q: Where should ownership checks live?**
A: In services, because ownership is business authorization, not HTTP formatting or raw
database access.

Strong answer signals:

- Points to project/task service checks.
- Explains how this reduces IDOR risk.

### Senior

**Q: When would this layered architecture become too much or not enough?**
A: It is enough for a small to medium API with clear modules. It may be too much for a
tiny script and not enough for a larger system that needs domain events, background jobs,
observability, or separate services.

Strong answer signals:

- Discusses trade-offs, not rules.
- Keeps the answer grounded in team size and change rate.

## Database and Prisma

### Junior

**Q: Why use migrations?**
A: Migrations version database structure so every environment can apply the same schema
changes predictably.

Strong answer signals:

- Mentions local, test, and CI databases.
- Distinguishes schema from data.

### Mid-Level

**Q: What is the N+1 query problem?**
A: It happens when code loads a list, then runs one query per item for related data.
Prisma can avoid it with explicit `include`, `select`, or better query shape.

Strong answer signals:

- Gives a concrete project/task example.
- Mentions measuring queries before optimizing.

### Senior

**Q: How do you keep a list endpoint fast as the table grows to millions of rows?**
A: Paginate with `skip`/`take` and cap the page size; index the columns you filter and sort
on; return the total via a database `count` (not by loading rows); and watch for offset
pagination getting slow on deep pages (consider keyset/cursor pagination). Group dependent
reads/writes in a transaction for consistency.

Strong answer signals:

- Points to `GET /tasks` pagination and `@@index` in `prisma/schema.prisma`.
- Knows indexes speed reads but cost writes.
- Mentions connection pooling and reading `EXPLAIN ANALYZE`.
- Bonus: contrasts offset vs cursor pagination (see [19 · Performance](../docs/19-performance-and-data-access.md)).

## Authentication and Authorization

### Junior

**Q: Why use bcrypt for passwords?**
A: bcrypt is slow and salted, which makes brute-force attacks more expensive than fast
hashes such as SHA-256.

Strong answer signals:

- Says passwords are never stored plain-text.
- Says hashes should never be returned in responses.

### Mid-Level

**Q: What is IDOR?**
A: Insecure Direct Object Reference: a user changes an ID and accesses another user's
resource because the server forgot an ownership check.

Strong answer signals:

- Connects to project/task ownership checks.
- Explains why hiding IDs is not a fix.

### Senior

**Q: What are JWT trade-offs?**
A: Stateless access tokens scale easily, but revocation is harder before expiry. Refresh
tokens, short expirations, rotation, and server-side token state can reduce risk.

Strong answer signals:

- Mentions payload is encoded, not encrypted.
- Discusses expiry and revocation.

## Testing

### Junior

**Q: Why use Supertest?**
A: It tests the Express app in-process without manually starting a server or binding a
port.

Strong answer signals:

- Mentions the `app.ts` and `server.ts` split.
- Explains integration confidence.

### Mid-Level

**Q: What should an endpoint integration test cover?**
A: It should cover the request, routing, validation, auth, service behavior, persistence,
and response status/body for at least one success and one failure path.

Strong answer signals:

- Mentions test database isolation.
- Mentions `401`, `403`, and `422` paths.

### Senior

**Q: A test passes locally but fails intermittently in CI. How do you approach it?**
A: Treat flakiness as a real bug. Common causes: shared state between tests (fix with
`resetDatabase` in `beforeEach`), time/ordering assumptions, unawaited promises, or relying
on insertion order instead of an explicit `orderBy`. Reproduce by running in-band, isolate
the test, and remove the hidden dependency rather than retrying until green.

Strong answer signals:

- Refuses to "just rerun" or add sleeps.
- Points to test isolation (`beforeEach(resetDatabase)`) and deterministic ordering.
- Distinguishes unit vs integration tests and where each belongs (test pyramid).

## Production

### Mid-Level

**Q: What would you improve before deploying this API?**
A: Tighten CORS origins, add refresh tokens if needed, add metrics/tracing, request IDs,
secrets management, backups, readiness checks, and deployment-specific configuration.

Strong answer signals:

- Does not list things already present as missing.
- Prioritizes based on risk.

### Senior

**Q: Walk me through what happens to in-flight requests during a deploy.**
A: The platform sends `SIGTERM`. A well-behaved service stops accepting new connections,
lets in-flight requests finish, closes the database connection, then exits — graceful
shutdown. Without it, the process is killed mid-request and clients see resets.

Strong answer signals:

- Points to `src/server.ts` graceful shutdown.
- Distinguishes liveness from readiness probes.

## Reliability & Resilience

### Senior

**Q: When should you retry a failed operation, and how?**
A: Retry only idempotent operations, only on transient errors, with exponential backoff and
jitter, and a cap. Do not retry non-idempotent writes (risk of duplicates) or 4xx client
errors (they will fail again).

Strong answer signals:

- Links retries to idempotency ([20 · API design](../docs/20-api-design-at-scale.md)).
- Mentions jitter to avoid synchronized retry storms.

**Q: Liveness vs readiness probe?**
A: Liveness asks "is the process alive?" — failing it restarts the pod. Readiness asks "can
it serve traffic now?" — failing it stops routing without restarting. Using one check for
both causes restart loops when a dependency is briefly down.

Strong answer signals:

- Notes that the current `/health` is a liveness probe.
- Would add a DB-checking readiness probe.

## API Design at Scale

### Senior

**Q: What makes an API change breaking, and how do you evolve safely?**
A: Removing/renaming a field, changing its type, or tightening validation breaks existing
clients. Evolve additively (optional new fields), keep one error shape and one pagination
envelope, and version (`/v2`) only for true breaking changes.

Strong answer signals:

- Treats the response shape as a contract.
- Points to the `{ data, total, page, limit }` envelope and uniform `{ message }` errors.

**Q: Why and how would you make `POST /tasks` idempotent?**
A: So a client retry (after a timeout) does not create duplicates. Accept an idempotency
key, store the first result against it, and return that stored result on a repeat — or rely
on a natural unique constraint.

## Observability

### Senior

**Q: An endpoint is intermittently slow in production. How do you find out why with no debugger?**
A: Use the three pillars: metrics to spot the latency/error spike, logs filtered by the
request's correlation id to see the slow step, and traces to see where time went across
services.

Strong answer signals:

- Points to structured pino logs and the `x-request-id` correlation id in `app.ts`.
- Separates logs (events) from metrics (aggregates).

## Caching

### Senior

**Q: You add a cache and users start seeing stale data. What went wrong and how do you design it correctly?**
A: Missing invalidation — writes did not delete/refresh the affected keys. Use cache-aside,
invalidate on every write that affects a key, key by all inputs (including user id), pick a
TTL per data type, and use a shared cache (Redis) once you run multiple instances.

Strong answer signals:

- Calls invalidation the hard part.
- Warns against caching per-user data under a shared key.
- Raises the thundering-herd problem and a mitigation.

## Scaling & Architecture

### Senior

**Q: How would you scale this API to handle 10x traffic?**
A: Measure first. Then scale horizontally: run multiple stateless instances (one process per
core via cluster/PM2/orchestrator) behind a load balancer, keep state in Postgres/Redis,
add caching and connection pooling, and offload slow work to a queue. The JWT design already
makes the API stateless, so any instance can serve any request.

Strong answer signals:

- Knows one Node process is single-threaded for JS, so you scale with processes.
- Ties statelessness to the JWT design.
- Decides from metrics, not guesses.
