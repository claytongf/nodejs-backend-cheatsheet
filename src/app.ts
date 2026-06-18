// Builds and configures the Express application (but does NOT start listening).
// Keeping this separate from server.ts lets tests import `app` directly with Supertest.
import { randomUUID } from 'node:crypto';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { openapiSpec } from './config/swagger.js';
import { prisma } from './database/prisma.js';
import { metricsMiddleware, renderMetrics } from './shared/utils/metrics.js';
import { landingPage } from './web/landing.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  // Security & cross-origin. The Content-Security-Policy is relaxed just enough for
  // Swagger UI (which uses inline styles/scripts) to render at /api-docs.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'", 'https:'],
          'img-src': ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );
  app.use(cors()); // allow cross-origin requests (tighten the origin in production)

  // Body parsing and structured request logging. Every request gets a correlation id
  // (reused from an incoming `x-request-id` header, or generated) so logs for a single
  // request can be traced end to end. The id is also echoed back in the response header.
  app.use(express.json());
  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const incoming = req.headers['x-request-id'];
        const id = (typeof incoming === 'string' && incoming) || randomUUID();
        res.setHeader('x-request-id', id);
        return id;
      },
    }),
  );

  // Count every request for the /metrics endpoint below. Placed early so it observes
  // all routes, including health checks and 404s.
  app.use(metricsMiddleware);

  // Basic rate limiting (relaxed in tests so the suite is not throttled):
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: env.NODE_ENV === 'test' ? 1000 : 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Minimal browser interfaces (not a frontend app):
  // a static landing page and interactive API docs.
  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(landingPage);
  });
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      customSiteTitle: 'Task Manager API — Docs',
    }),
  );

  // Liveness check (no auth): is the process up and able to respond at all?
  // A liveness probe should NOT touch the database — if the DB is down we still want the
  // process to stay alive (an orchestrator restarting it would not bring the DB back).
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // Readiness check (no auth): should this instance receive traffic *right now*?
  // Here we verify the database is reachable. If it is not, we return 503 so a load
  // balancer/orchestrator stops routing requests to this instance until it recovers.
  // See docs/21-reliability-and-resilience.md and docs/23-observability.md.
  app.get('/ready', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready' });
    } catch (err) {
      logger.error({ err }, 'Readiness check failed: database unreachable');
      res.status(503).json({ status: 'not_ready', reason: 'database_unreachable' });
    }
  });

  // Metrics endpoint (no auth) in Prometheus text format. In production you would protect
  // this (network policy or auth) so it is only reachable by your scraper.
  app.get('/metrics', (_req: Request, res: Response) => {
    res.type('text/plain; version=0.0.4').send(renderMetrics());
  });

  // Feature routers.
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/projects', projectsRouter);
  app.use('/tasks', tasksRouter);

  // 404 fallback, then the centralized error handler — ORDER MATTERS (must be last).
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
