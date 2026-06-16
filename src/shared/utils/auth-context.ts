// Helper to read the authenticated user from the request in a type-safe way.
// Use this in controllers after the `authenticate` middleware has run.
import type { Request } from 'express';
import { UnauthorizedError } from '../errors/index.js';
import type { AuthUser } from '../types/index.js';

export function requireUser(req: Request): AuthUser {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  return req.user;
}
