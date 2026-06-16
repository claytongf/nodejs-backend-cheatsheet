// The only place that touches prisma.user. Returns public fields by default;
// `findByEmail` returns the full record (including passwordHash) for auth use.
import type { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma.js';
import type { UpdateUserInput } from './users.schemas.js';

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
  findMany() {
    return prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: 'desc' } });
  },

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

  update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data, select: publicSelect });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
