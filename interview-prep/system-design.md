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
