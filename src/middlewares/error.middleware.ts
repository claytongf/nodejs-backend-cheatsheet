// The single, centralized error handler. Registered LAST in app.ts.
// It has four parameters, which is how Express recognizes error-handling middleware.
// It maps typed application errors to their status codes; everything else becomes a
// safe, generic 500. (Validation-error formatting is added in a later phase.)
import type { ErrorRequestHandler } from 'express';
import { AppError } from '../shared/errors/index.js';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Unknown error: log full details server-side, return a safe message to the client.
  // eslint-disable-next-line no-console -- replaced by structured logging in a later phase
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
