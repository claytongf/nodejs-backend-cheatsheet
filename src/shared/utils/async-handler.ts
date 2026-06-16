// Wraps an async route handler so any rejected promise is forwarded to the
// error middleware via next(err). This removes try/catch from every controller.
import type { RequestHandler } from 'express';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
