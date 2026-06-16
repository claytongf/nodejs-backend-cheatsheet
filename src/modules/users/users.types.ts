// Public-facing user shape (never includes passwordHash).
import type { Role } from '@prisma/client';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
