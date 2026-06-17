# 09 · Correlated Request Logging

Level: Advanced

## Context

Every request already gets a correlation id (`x-request-id`) via `pino-http`'s `genReqId` in
[app.ts](../src/app.ts), and the HTTP log line carries it. But logs written from inside a
service do **not** yet share that id. This lab propagates the correlation id into your
business-logic logs so a single request's logs can all be filtered together.

Read [23 · Observability](../docs/23-observability.md) first.

## Requirements

- Use the per-request logger `req.log` (provided by `pino-http`, already bound to the
  request's `reqId`) inside a service call path.
- A single request should produce multiple log lines that all share the same `reqId`.
- Do not log secrets or password hashes.

## Likely Files

- `src/modules/tasks/tasks.controller.ts` (pass `req.log` down)
- `src/modules/tasks/tasks.service.ts` (accept and use the logger)
- `src/app.ts` (reference for the existing `genReqId` setup)

## Suggested Steps

1. In a controller (e.g. `create`), read `req.log` and pass it into the service call.
2. In the service, log a structured event such as
   `log.info({ taskId, projectId }, 'task created')`.
3. Start the dev server, create a task, and confirm the HTTP log and the service log share
   the same `reqId`.
4. Send an `x-request-id` header and confirm it is reused (not regenerated).
5. Run the validation checklist.

## Acceptance Criteria

- Service logs for one request carry the same `reqId` as the HTTP log line.
- An incoming `x-request-id` header is reused and echoed back in the response.
- No sensitive fields appear in any log.

## Interview Follow-Ups

- What are the three pillars of observability, and which one does a correlation id support?
- Why propagate the correlation id to downstream services?
- Logs vs metrics: why should you not compute a request rate by counting log lines?
</content>
