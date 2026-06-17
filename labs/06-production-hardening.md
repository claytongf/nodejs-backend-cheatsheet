# 06 · Production Hardening Review

Level: Advanced

## Context

The project already includes several production-minded pieces: helmet, CORS, rate limiting,
structured logging, environment validation, Docker, graceful shutdown, and CI migrations.
This lab asks you to review what remains.

## Requirements

- Review production risks in configuration, auth, logging, database, deployment, and
  observability.
- Propose improvements without overengineering the learning project.
- Implement one small hardening change.
- Document why the change matters.

## Likely Files

- `src/app.ts`
- `src/config/env.ts`
- `src/config/logger.ts`
- `src/server.ts`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `docs/13-security-best-practices.md`
- `docs/15-docker-and-production.md`

## Suggested Improvements

Choose one:

- Restrict CORS origins by environment variable.
- Add request IDs to logs and responses.
- Add readiness checks that verify database connectivity.
- Add safer production error response examples.
- Document backup and migration rollback strategy.

## Acceptance Criteria

- The chosen improvement has a clear production reason.
- Tests or documentation cover the behavior.
- Existing validation still passes.
- The change is small enough to teach, not distract.

## Interview Follow-Ups

- What is the difference between a health check and a readiness check?
- Why can permissive CORS be acceptable locally but risky in production?
- What operational signals would you add before deploying this API?
