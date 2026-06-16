// The single, centralized error handler. Registered LAST in app.ts.
// It has four parameters, which is how Express recognizes error-handling middleware.
// In later phases this learns to format validation errors and typed application errors;
// for now it logs the error and returns a safe, generic 500 response.
import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  // eslint-disable-next-line no-console -- replaced by structured logging in a later phase
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
