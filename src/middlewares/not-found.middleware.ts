// Catches any request that did not match a route. Registered after all routers
// but before the error middleware.
import type { Request, Response } from 'express';

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
