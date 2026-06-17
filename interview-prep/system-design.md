# System Design Practice

Use these prompts to practice extending the project without jumping to unnecessary
complexity.

## Prompt 1: Task Reminders

Design reminders that notify users before a task is due.

Discuss:

- Where due dates live in the schema.
- Whether reminders need a queue.
- How retries should work.
- How to avoid duplicate notifications.
- What to test first.

Good answer:

- Starts with a simple schema change.
- Uses Redis/queue only for asynchronous delivery.
- Mentions idempotent jobs.

## Prompt 2: Multi-Tenant Workspaces

Design workspaces so users can collaborate on projects.

Discuss:

- Workspace, membership, and role models.
- How ownership checks change.
- How admin differs from workspace owner.
- Migration strategy from current owner-based projects.

Good answer:

- Separates global app roles from workspace roles.
- Recognizes that authorization becomes more complex.

## Prompt 3: Audit Log

Design audit logs for project and task changes.

Discuss:

- What events should be recorded.
- Where logging belongs in the application layers.
- How to avoid logging secrets.
- How to query audit history.

Good answer:

- Records actor, action, target, timestamp, and metadata.
- Keeps logs append-only.

## Prompt 4: Public API Rate Limits

Design rate limits for unauthenticated and authenticated traffic.

Discuss:

- Per-IP vs per-user limits.
- Different limits for auth endpoints.
- Redis-backed limits across multiple instances.
- Error response shape.

Good answer:

- Explains why in-memory limits are not enough for multi-instance production.

---

## Senior Scenarios

These prompts expect production scale, trade-offs, and a "measure first" instinct. Tie each
answer to a real file or chapter where you can.

## Prompt 5: Scale the Task API to 1,000,000 users

The Task Manager is a hit. `GET /tasks` is slow and the single instance is saturated.

Discuss:

- **Diagnose first**: which metric tells you it is the DB vs the event loop vs the network?
- **Data**: pagination (already present), indexing the filtered/sorted columns, offset vs
  cursor pagination on deep pages, connection pooling.
- **Compute**: run multiple stateless instances behind a load balancer; one process per core.
- **Caching**: cache hot reads in Redis with cache-aside; invalidate on write.
- **Async**: move slow side-effects (emails, exports) to a queue.

Good answer:

- Starts by measuring, not by adding infrastructure.
- Knows the API is already stateless (JWT), so horizontal scaling is straightforward.
- Names a concrete index and the envelope/pagination already in place.
- Discusses cache invalidation as the hard part.
- References [19](../docs/19-performance-and-data-access.md),
  [24](../docs/24-caching.md), [25](../docs/25-scaling-and-architecture.md).

## Prompt 6: Real-Time Task Updates

When a task changes, collaborators should see it update live.

Discuss:

- Transport: WebSockets vs Server-Sent Events vs polling, and the trade-offs.
- How real-time fan-out works across **multiple instances** (a shared pub/sub like Redis).
- Authentication on the socket connection (reuse the JWT).
- What still goes through the normal REST write path (the socket is a notification channel,
  not the source of truth).

Good answer:

- Keeps the database as the source of truth; the socket only pushes change events.
- Recognizes that with N instances you need a shared pub/sub, not in-process events
  (ties back to statelessness in [25](../docs/25-scaling-and-architecture.md)).
- Picks SSE for one-way updates, WebSockets for bidirectional.

## Prompt 7: Safe Retries for `POST /tasks`

A mobile client times out and retries `POST /tasks`, creating duplicate tasks.

Discuss:

- Why retries happen (mobile networks, load balancers, queue redelivery).
- Idempotency keys: where to store them, their TTL, and what a repeat returns.
- What to do if the retry body differs from the original request.
- Alternative: a natural unique constraint instead of a key.

Good answer:

- Connects idempotency to reliability and API design
  ([20](../docs/20-api-design-at-scale.md), [21](../docs/21-reliability-and-resilience.md)).
- Stores the first response against the key and replays it on a repeat.
- Rejects a repeat key with a different body rather than silently overwriting.
