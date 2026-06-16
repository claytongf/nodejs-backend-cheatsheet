// The single, centralized error handler. Registered LAST in app.ts.
// It has four parameters, which is how Express recognizes error-handling middleware.
// It formats validation errors (Zod) and typed application errors; everything else
// becomes a safe, generic 500.
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/index.js';

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

  // Unknown error: log full details server-side, return a safe message to the client.
  // eslint-disable-next-line no-console -- replaced by structured logging in a later phase
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
