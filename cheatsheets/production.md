# Cheatsheet · Production

## Docker Compose

| Command                  | Does                |
| ------------------------ | ------------------- |
| `docker compose up -d`   | Start in background |
| `docker compose ps`      | Status              |
| `docker compose logs -f` | Follow logs         |
| `docker compose down`    | Stop                |
| `docker compose down -v` | Stop + wipe volumes |

## Build & run

```bash
npm run build          # TS -> dist/
npm start              # node dist/server.js
npm run prisma:deploy  # apply migrations (prod/CI)
```

## Production checklist

- [ ] `NODE_ENV=production`
- [ ] Secrets injected via env (never committed)
- [ ] Env validated at startup (fail fast)
- [ ] `prisma migrate deploy` as a release step
- [ ] Structured JSON logs to stdout (pino)
- [ ] `/health` endpoint for the load balancer
- [ ] Graceful shutdown on `SIGTERM`/`SIGINT`
- [ ] `helmet`, rate limiting, CORS configured
- [ ] `npm ci --omit=dev` in the final image
- [ ] Multi-stage Docker build (small image)

## Graceful shutdown

```ts
const server = app.listen(env.PORT);
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
```

## Health endpoint

```ts
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
```

## Logging (pino)

```ts
import pino from 'pino';
export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
logger.info({ userId }, 'user logged in');
```

## Dev vs prod migrations

| Env     | Command                 |
| ------- | ----------------------- |
| Dev     | `prisma migrate dev`    |
| Prod/CI | `prisma migrate deploy` |
