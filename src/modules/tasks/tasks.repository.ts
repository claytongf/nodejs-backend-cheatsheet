// Data access for tasks. The ONLY layer that touches Prisma.
// Swapping the in-memory store for Prisma did not require any change to the
// service or controller — that is the payoff of the layered architecture.
import { prisma } from '../../database/prisma.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schemas.js';

export const tasksRepository = {
  findAll() {
    return prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  create(input: CreateTaskInput) {
    return prisma.task.create({ data: input });
  },

  update(id: string, input: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
