// The single, centralized error handler. Registered LAST in app.ts.
// It maps known error types to HTTP responses and hides internals for unknown errors.
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/index.js';
import { logger } from '../config/logger.js';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Unknown error: log the full details, return a safe generic message.
  logger.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
