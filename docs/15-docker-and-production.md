# 15 · Docker & Production

## What it is

**Docker** packages your app and its dependencies into a portable **image** that runs the
same on any machine. **Docker Compose** orchestrates multiple containers (app + Postgres +
Redis) for local development. "Production" adds concerns like config, migrations, logging,
health checks, and graceful shutdown.

## Why it matters in backend development

"Works on my machine" disappears when everyone runs the same image. Containers are the
standard deployment unit, and understanding the dev→prod path (build, migrate, run) is
expected of backend developers.

## How it appears in real Node.js jobs

You will write Dockerfiles, manage env per environment, run `prisma migrate deploy` on
release, ship structured logs, expose a `/health` endpoint, and handle `SIGTERM` for
zero-downtime deploys.

## This project's setup

`docker-compose.yml` runs **PostgreSQL** and **Redis** for local dev. The app itself runs
on your host via `npm run dev` during learning. For deployment you would add a production
`Dockerfile`:

```dockerfile
# Multi-stage build for a small production image
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Production checklist (this project supports)

- Config validated at startup (`config/env.ts`) — fail fast on bad config.
- Structured JSON logs via pino (`config/logger.ts`).
- `/health` endpoint for load balancers/orchestrators.
- Graceful shutdown on `SIGTERM`/`SIGINT` in `server.ts`.
- Migrations run with `prisma migrate deploy` (in CI: see `.github/workflows/ci.yml`).

## Simple code example

```ts
// Graceful shutdown (in server.ts)
const server = app.listen(env.PORT);
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
```

## Laravel comparison

| Laravel | Node / Docker |
| --- | --- |
| Laravel Sail | `docker-compose.yml` |
| `php artisan migrate --force` | `prisma migrate deploy` |
| `.env` per environment | `.env` / container env vars |
| Forge / Vapor deploy | Docker image + orchestrator |
| `storage/logs/laravel.log` | pino JSON logs to stdout |

## Common beginner mistakes

- Baking secrets into the image instead of injecting env at runtime.
- Running `migrate dev` in production (use `migrate deploy`).
- Logging to files inside the container instead of stdout.
- Huge images (copying `node_modules`, dev deps) — use multi-stage builds.
- No health check or graceful shutdown, causing failed/janky deploys.

## Best practices

- Multi-stage builds; install only production deps in the final image.
- Inject config via env at runtime; never commit secrets.
- Run migrations as a deploy step, not on app boot (or carefully gated).
- Log structured JSON to stdout; let the platform collect it.
- Expose `/health`; handle `SIGTERM` for graceful shutdown.

## Study checklist

- [ ] I can run the stack with `docker compose up -d`.
- [ ] I understand multi-stage Docker builds.
- [ ] I know `migrate dev` vs `migrate deploy`.
- [ ] I can implement a health check and graceful shutdown.

## Interview questions

**Q: Why multi-stage Docker builds?**
A: Build with dev tools in one stage, copy only the compiled output and production deps
into a smaller final image — faster, lighter, more secure.

**Q: `migrate dev` vs `migrate deploy`?**
A: `dev` creates migrations and is interactive (development); `deploy` applies existing
migrations non-interactively (CI/production).

**Q: Why handle SIGTERM?**
A: Orchestrators send SIGTERM before stopping a container; handling it lets in-flight
requests finish and connections close cleanly (graceful shutdown).
