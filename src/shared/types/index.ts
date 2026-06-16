// Shared types used across modules, plus an Express `Request` augmentation
// so `req.user` is typed everywhere after the authenticate middleware runs.
import type { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
