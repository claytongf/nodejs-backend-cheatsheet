# 20 · API Design at Scale

## Learning Objective

By the end of this chapter, you should be able to design API responses that stay stable as
the product grows: consistent pagination envelopes, predictable error shapes, versioning,
and idempotent writes.

## What It Is

API design at scale is about **contracts**. Clients (web apps, mobile apps, other services)
depend on the exact shape of your responses. Good design makes those shapes consistent,
evolvable, and safe to retry.

## Why It Matters in Backend Development

Once another team or app consumes your API, you cannot freely change it. Thinking about
pagination, versioning, and idempotency *before* launch saves painful migrations later, and
it is a frequent senior interview topic.

## How It Appears in Real Node.js Jobs

- Every list endpoint returns the same `{ data, total, page, limit }` envelope so clients
  share one pagination component.
- A breaking change ships under `/v2` while `/v1` keeps working.
- A "create payment" endpoint accepts an idempotency key so a retried request does not
  charge twice.
- Errors always look the same, so clients write one error handler.

## Simple Code Example

```ts
// A consistent list envelope — clients always read the same fields.
type Page<T> = { data: T[]; total: number; page: number; limit: number };

// Idempotency: remember the key, return the first result on a retry.
const seen = idempotencyStore.get(key);
if (seen) return seen;
const result = await doWork();
idempotencyStore.set(key, result);
```

## Practical Example from This Project

- **Every** list endpoint (`GET /tasks`, `GET /projects`, `GET /users`) returns the same
  `{ data, total, page, limit }` envelope. The shape and the `page`/`limit` rules live in one
  place — [src/shared/utils/pagination.ts](../src/shared/utils/pagination.ts) — and each
  module extends the shared `paginationSchema` with its own filters/sort. This is the "one
  envelope across all endpoints" rule made real; it is documented in Swagger as
  `PaginatedTasks`/`PaginatedProjects`/`PaginatedUsers` in
  [src/config/swagger.ts](../src/config/swagger.ts).
- Errors are uniform: the [error middleware](../src/middlewares/error.middleware.ts) always
  emits `{ message }` (plus `{ errors }` for validation), so every client parses errors the
  same way. This is the contract half of [08 · Error handling](08-error-handling.md).
- Validation is centralized in `*.schemas.ts`, so the **request** contract is explicit too.

## Versioning

This learning API is unversioned for simplicity. In production you would mount routers under
a prefix (`app.use('/v1', v1Router)`) and only create `/v2` for a **breaking** change —
adding an optional field is backward-compatible and does not need a new version.

## Guided Exercise

The three existing list endpoints already share the envelope via the shared
`paginationSchema`/`toPage` helpers. Practice the pattern by adding a **new** filter:

1. Add an optional `q` (search) parameter to `listProjectsQuerySchema` (extend, do not
   duplicate, the shared `paginationSchema`).
2. Translate it into a Prisma `where` with `name: { contains: q, mode: 'insensitive' }`.
3. Add a test asserting the search narrows results while keeping the same envelope.

## Practical Challenge

Design (in writing) how you would add an idempotency key to `POST /tasks`. Acceptance
criteria: explain where the key is stored, how long it lives, what happens on a retry with
the same key, and what happens if the body differs from the first request.

## Common Beginner Mistakes

- Different list endpoints returning different shapes (bare array here, envelope there).
- Breaking the response contract without a version bump.
- Versioning for non-breaking changes (adds churn for no reason).
- Making writes non-idempotent, so client retries cause duplicates.
- Leaking internal fields (e.g. `passwordHash`) in responses.

## Best Practices

- One pagination envelope across all list endpoints.
- One error shape across the whole API.
- Version only on breaking changes; prefer additive, backward-compatible changes.
- Make critical writes idempotent (idempotency keys or natural unique constraints).
- Never return secrets; shape responses deliberately with `select`.

## Study Checklist

- [ ] I can describe a consistent pagination envelope and why it helps clients.
- [ ] I know when an API change is breaking and needs a new version.
- [ ] I can explain idempotency and when a write needs it.
- [ ] I can explain why one error shape matters.

## Interview Questions

**Q: What makes an API change "breaking"?**
A: Anything existing clients rely on that you remove or change incompatibly — removing a
field, renaming it, changing its type, or tightening validation. Adding optional fields is
usually non-breaking.

**Q: What is idempotency and why does it matter for APIs?**
A: An idempotent request produces the same result no matter how many times it runs. It
matters because networks retry; without it, retries can create duplicates or double-charge.

**Q: Why return a pagination envelope instead of a bare array?**
A: Clients need the total (for page counts) and the current page/limit; a stable envelope
lets every consumer share one pagination implementation.

## Strong Answer Signals

A strong answer treats the response shape as a contract, prefers additive evolution over
versioning, and connects idempotency to real retry behavior (load balancers, mobile
networks, queue redelivery).
</content>
