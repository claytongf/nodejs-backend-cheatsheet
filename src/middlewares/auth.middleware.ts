// Authentication + role authorization middleware.
// `authenticate` verifies the Bearer token and attaches req.user.
// `requireRole` checks the authenticated user's role.
import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../shared/errors/index.js';
import { verifyToken } from '../shared/utils/jwt.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new UnauthorizedError('Missing authentication token');
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  next();
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    if (req.user.role !== role) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    next();
  };
}
