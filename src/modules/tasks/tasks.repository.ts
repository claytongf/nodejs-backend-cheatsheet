// The only place that touches prisma.task.
import type { Prisma, TaskStatus } from '@prisma/client';
import { prisma } from '../../database/prisma.js';
import type { UpdateTaskInput } from './tasks.schemas.js';

// Parameters for a paginated, filtered, sorted list query.
export interface ListTasksParams {
  where: Prisma.TaskWhereInput;
  orderBy: Prisma.TaskOrderByWithRelationInput;
  skip: number;
  take: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
  ownerId: string;
}

export const tasksRepository = {
  // Returns one page of tasks plus the total count, in a single round trip.
  // $transaction runs both queries together so the count matches the page.
  list(params: ListTasksParams) {
    return prisma.$transaction([
      prisma.task.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
      }),
      prisma.task.count({ where: params.where }),
    ]);
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
