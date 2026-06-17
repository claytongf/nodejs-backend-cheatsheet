# Debugging Challenges

Use these drills to practice reading failures and finding root causes.

## Challenge 1: Cross-User Task Access

Symptom: a user can fetch another user's task by ID.

Investigate:

- Was the wrong token used in the test?
- Does the route require authentication?
- Does the service call an ownership check?
- Does the repository return enough data to authorize?

Strong fix:

- Add a regression test for cross-user task access.
- Keep admin access working.
- Return `403` for authenticated but unauthorized users.

## Challenge 2: Tests Pass Locally but Fail in CI

Symptom: Prisma tests fail because tables do not exist.

Investigate:

- Did CI apply migrations?
- Is `DATABASE_URL` pointing to the test database?
- Does Prisma config load the expected env file?
- Is the database service healthy before migrations run?

Strong fix:

- Align local setup with CI.
- Document the setup command.
- Avoid relying on dev database state.

## Challenge 3: Validation Does Not Catch Bad Input

Symptom: `POST /tasks` accepts malformed input.

Investigate:

- Is the route using the validation middleware?
- Is the schema checking the right field?
- Is the controller reading from validated body?
- Does the test assert `422`?

Strong fix:

- Add a focused invalid-input test.
- Keep validation in schemas, not controllers.

## Challenge 4: Password Hash Leaks

Symptom: an auth response includes `passwordHash`.

Investigate:

- Which repository method returns the user?
- Does the service strip sensitive fields?
- Does the test assert the hash is absent?
- Does Swagger show the safe response shape?

Strong fix:

- Strip sensitive fields in the service.
- Add regression tests.
- Keep API docs aligned.

---

## Senior Challenges

These drills are about production failure modes you cannot see with a single failing test.
The skill is forming a hypothesis from symptoms and confirming it with the right signal.

## Challenge 5: The Whole Service Goes Slow Under One Endpoint

Symptom: when one report endpoint is called, **every** request slows down, including
`/health`.

Investigate:

- Is there synchronous CPU work (big loop, JSON/crypto) blocking the event loop?
- Does event-loop lag spike at the same time?
- Is the work I/O-bound (then it should not block) or CPU-bound (then it does)?

Strong fix:

- Move CPU-bound work to a worker thread or a queue/worker process.
- Confirm with an event-loop lag metric, not by guessing.
- See [21 · Reliability](../docs/21-reliability-and-resilience.md) and
  [25 · Scaling](../docs/25-scaling-and-architecture.md).

## Challenge 6: Requests Hang Under Load, Then Recover

Symptom: under traffic, requests queue and time out; later they recover.

Investigate:

- Is the database **connection pool** exhausted (more concurrent queries than connections)?
- Is a query missing an index and holding connections too long?
- Is something leaking connections (not releasing them)?

Strong fix:

- Size the pool to the workload; add indexes to shorten query time; ensure connections are
  released. Tie back to [19 · Performance](../docs/19-performance-and-data-access.md).

## Challenge 7: Memory Grows Until the Process Crashes

Symptom: RSS climbs over hours until an out-of-memory restart.

Investigate:

- Is something accumulating in a module-level structure (e.g. an unbounded cache `Map`)?
- Are listeners or timers added per request and never removed?
- Does a heap snapshot show one growing retainer?

Strong fix:

- Bound caches (TTL/size); the repo's `TtlCache` evicts on read but is **not** size-bounded,
  so in production back it with Redis (see [24 · Caching](../docs/24-caching.md)).
- Remove per-request listeners/timers; compare heap snapshots to find the retainer.

## Challenge 8: Lost Update / Stale Read

Symptom: two concurrent updates to the same task, and one change silently disappears; or a
cached read serves stale data after a write.

Investigate:

- Are read-modify-write steps done without a transaction or optimistic locking?
- After a write, is the relevant cache key invalidated?
- Are dependent writes grouped so they cannot half-apply?

Strong fix:

- Use a transaction (and optimistic concurrency where needed) for read-modify-write.
- Invalidate cache keys on write; key by all inputs.
- See [19 · Performance](../docs/19-performance-and-data-access.md) and
  [24 · Caching](../docs/24-caching.md).
