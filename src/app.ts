// Builds and configures the Express application (but does NOT start listening).
// Keeping this separate from server.ts lets tests import `app` directly with Supertest.
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  // Security & cross-origin:
  app.use(helmet()); // safe HTTP response headers
  app.use(cors()); // allow cross-origin requests (tighten the origin in production)

  // Body parsing and structured request logging:
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Basic rate limiting (relaxed in tests so the suite is not throttled):
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: env.NODE_ENV === 'test' ? 1000 : 100,
      standardHeaders: true,
      legacyHeaders: false,
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
