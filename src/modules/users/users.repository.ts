// Data access for users. The ONLY layer that touches prisma.user.
// `findByEmail` returns the full record (including passwordHash) for authentication;
// everything else returns only public fields. (Full CRUD is added in the next phase.)
import type { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma.js';

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export const usersRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicSelect });
  },

  // Full record (with passwordHash) — used only by the auth flow.
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: CreateUserData) {
    return prisma.user.create({ data, select: publicSelect });
  },
};
