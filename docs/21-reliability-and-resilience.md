# 21 · Reliability & Resilience

## Learning Objective

By the end of this chapter, you should be able to keep an API healthy under failure:
graceful shutdown, timeouts, retries with backoff, rate limiting, and proper health checks
(liveness vs readiness).

## What It Is

Reliability is what your service does when things go wrong — a deploy restarts it, a
dependency is slow, a client floods it with requests. Resilient services fail predictably
and recover on their own instead of crashing or corrupting data.

## Why It Matters in Backend Development

Production traffic is hostile: clients retry, networks drop, platforms send `SIGTERM`
mid-request during every deploy. Code that ignores this loses in-flight work or wedges the
whole process. Handling it is a core senior responsibility.

## How It Appears in Real Node.js Jobs

- Kubernetes sends `SIGTERM`; your app must finish in-flight requests, then exit cleanly.
- A load balancer calls a **readiness** probe before sending traffic and a **liveness**
  probe to decide whether to restart.
- A flaky third-party call is wrapped in a retry-with-backoff.
- Login is rate-limited harder than the rest of the API to slow brute-force attacks.

## Simple Code Example

```ts
// Retry with exponential backoff for a transient failure.
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 100)); // 200ms, 400ms, ...
    }
  }
}
```

## Practical Example from This Project

- **Graceful shutdown** is already implemented in
  [src/server.ts](../src/server.ts): on `SIGTERM`/`SIGINT` it stops accepting new
  connections (`server.close`) and disconnects Prisma before exiting. Read it line by line.
- **Rate limiting** is mounted globally in [src/app.ts](../src/app.ts) with
  `express-rate-limit` (relaxed in tests). See [Cookbook #14](cookbook.md#14-rate-limit-a-specific-route)
  to add a stricter limit to a single route like login.
- **Health check**: `GET /health` is a simple liveness probe. A real readiness probe would
  also check that the database is reachable before reporting "ready".

## Liveness vs Readiness

- **Liveness** = "is the process alive?" If it fails, the platform **restarts** the pod.
- **Readiness** = "can it serve traffic right now?" If it fails (e.g. DB not connected yet),
  the platform **stops routing** traffic but does not restart.

Using the same check for both is a common mistake: a slow database then triggers restart
loops instead of just pausing traffic.

## Guided Exercise

1. Add a `GET /health/ready` route that runs `await prisma.$queryRaw\`SELECT 1\`` and returns
   503 if it throws.
2. Keep `GET /health` as the cheap liveness probe (no DB call).
3. Write a test asserting `/health/ready` returns 200 when the DB is up.

## Practical Challenge

Add a per-route limiter to `POST /auth/login` (e.g. 5/minute) without throttling the rest of
the API. Acceptance criteria: a test shows the 6th rapid login attempt returns 429, while
other endpoints are unaffected.

## Common Beginner Mistakes

- `process.exit()` on a signal without draining in-flight requests.
- Using the liveness probe to check dependencies, causing restart loops.
- Retrying without backoff (a retry storm makes an outage worse).
- Retrying non-idempotent writes (duplicates) — see [20 · API design](20-api-design-at-scale.md).
- No timeout on outbound calls, so one slow dependency exhausts the event loop.

## Best Practices

- Drain on `SIGTERM`: stop new work, finish in-flight, close DB, then exit.
- Separate liveness and readiness checks.
- Set timeouts on every outbound call; retry idempotent ones with backoff + jitter.
- Rate-limit globally, and harder on auth endpoints.
- Surface failures in logs/metrics — see [23 · Observability](23-observability.md).

## Study Checklist

- [ ] I can explain graceful shutdown and trace it in `server.ts`.
- [ ] I can distinguish liveness from readiness.
- [ ] I can implement retry with exponential backoff and say when not to retry.
- [ ] I know why auth endpoints get stricter rate limits.

## Interview Questions

**Q: What happens to in-flight requests during a deploy, and how do you handle it?**
A: The platform sends `SIGTERM`. You stop accepting new connections, let in-flight requests
finish, close resources (DB), then exit — that is graceful shutdown.

**Q: Liveness vs readiness probe?**
A: Liveness decides whether to restart the process; readiness decides whether to send it
traffic. Checking dependencies in liveness causes needless restarts.

**Q: When should you NOT retry a failed request?**
A: When the operation is not idempotent (retrying could duplicate it) or the error is a
client error (4xx) that will fail again.

## Strong Answer Signals

A strong answer ties resilience to real platform behavior (SIGTERM on every deploy), adds
**jitter** to backoff to avoid synchronized retries, and connects retries to idempotency.
</content>
