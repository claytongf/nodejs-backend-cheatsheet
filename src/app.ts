// Builds and configures the Express application (but does NOT start listening).
// Keeping this separate from server.ts lets tests import `app` directly later
// (e.g. with Supertest) without binding to a port.
import express, { type Request, type Response } from 'express';
import { authRouter } from './modules/auth/auth.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  // Parse incoming JSON request bodies into req.body.
  app.use(express.json());

  // Health check: no dependencies, handy for load balancers and tests.
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // Feature routers.
  app.use('/auth', authRouter);
  app.use('/tasks', tasksRouter);

  // 404 fallback, then the centralized error handler — ORDER MATTERS:
  // these must come AFTER all routes.
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
