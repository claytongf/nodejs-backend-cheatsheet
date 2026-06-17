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

  // Health check (no auth).
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', uptime: process.uptime() });
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
