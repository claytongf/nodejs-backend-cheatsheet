# 23 · Observability

## Learning Objective

By the end of this chapter, you should be able to make a service observable: structured
logs, request correlation IDs, metrics, and traces — so you can answer "what happened?" in
production without a debugger.

## What It Is

Observability is your ability to understand what a running system is doing from the outside,
using three pillars:

- **Logs** — structured, timestamped events (what happened).
- **Metrics** — numbers over time (request rate, error rate, latency).
- **Traces** — the path of one request across services (where the time went).

## Why It Matters in Backend Development

You cannot attach a debugger to production. When an endpoint is slow or failing, logs,
metrics, and traces are how you diagnose it. Correlating all the logs for a single request
is often the difference between a 5-minute fix and a 5-hour hunt.

## How It Appears in Real Node.js Jobs

- Logs are JSON shipped to a platform (Datadog, Loki, CloudWatch) and queried, not `grep`ed.
- Each request carries a **correlation/request id** so every log line for that request can
  be filtered together — and the id is passed to downstream services.
- Dashboards track the "RED" metrics: **R**ate, **E**rrors, **D**uration.
- Alerts fire on error-rate or latency thresholds, not on individual log lines.

## Simple Code Example

```ts
// Structured log: machine-parseable fields, not a string you have to regex.
logger.info({ userId, taskId, durationMs }, 'task completed');

// Correlate: attach a request id so all logs for one request share it.
logger.child({ reqId }).info('processing');
```

## Practical Example from This Project

- [src/config/logger.ts](../src/config/logger.ts) configures **pino** for structured JSON
  logging (pretty-printed in dev, raw JSON in prod for log shippers).
- [src/app.ts](../src/app.ts) wires **pino-http**, and now assigns a **correlation id** to
  every request via `genReqId`: it reuses an incoming `x-request-id` header (so a gateway or
  upstream service can set it) or generates a UUID, then echoes it back in the response
  header. Every request log line includes that `reqId`.
- Try it: `curl -i http://localhost:3000/health` and look for the `x-request-id` response
  header — then find the same id in the server logs.

## Guided Exercise

1. Start the dev server and hit `GET /tasks` with and without an `x-request-id` header.
2. Confirm the response echoes the id, and the logs show the same `reqId`.
3. Add a `logger.info` in a service and confirm it appears with structured fields.

## Practical Challenge

Add a `logger.child({ reqId })` to the request (via `req.log`, which pino-http provides) and
use it inside the tasks service so business-logic logs carry the same correlation id as the
HTTP log. Acceptance criteria: a single request produces multiple log lines that all share
one `reqId`.

## Common Beginner Mistakes

- `console.log` with string concatenation instead of structured fields.
- Logging secrets, tokens, or passwords (scrub them).
- No correlation id, so you cannot group a request's logs.
- Logging so much that the signal drowns (or so little you learn nothing).
- Treating logs as metrics — counting log lines instead of emitting real metrics.

## Best Practices

- Log structured JSON in production; include a correlation id on every line.
- Propagate the request id to downstream calls.
- Track RED metrics (rate, errors, duration) and alert on them.
- Scrub sensitive fields before logging.
- Use log levels deliberately (`info` for normal flow, `error` for failures).

## Study Checklist

- [ ] I can name the three pillars of observability.
- [ ] I can explain why correlation ids matter and find one in this project.
- [ ] I know what RED metrics are.
- [ ] I can explain why structured logs beat string logs.

## Interview Questions

**Q: What are the three pillars of observability?**
A: Logs (discrete events), metrics (aggregated numbers over time), and traces (a request's
path across services).

**Q: Why use a correlation/request id?**
A: To group every log line produced while handling one request — across middleware,
services, and downstream calls — so you can reconstruct exactly what happened.

**Q: Why structured (JSON) logging?**
A: It is machine-parseable, so a log platform can index, filter, and aggregate by fields
instead of relying on fragile text matching.

## Strong Answer Signals

A strong answer distinguishes logs from metrics (don't count log lines to get a rate),
mentions propagating the correlation id downstream, and notes scrubbing PII/secrets before
logging.
</content>
