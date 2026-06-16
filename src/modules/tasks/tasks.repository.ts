// The only place that touches prisma.task.
import type { TaskStatus } from '@prisma/client';
import { prisma } from '../../database/prisma.js';
import type { UpdateTaskInput } from './tasks.schemas.js';

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
  ownerId: string;
}

export const tasksRepository = {
  findMany() {
    return prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findByOwner(ownerId: string) {
    return prisma.task.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  create(data: CreateTaskData) {
    return prisma.task.create({ data });
  },

  update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data });
  },

  setStatus(id: string, status: TaskStatus) {
    return prisma.task.update({ where: { id }, data: { status } });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
