// The only place that touches prisma.project.
import type { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma.js';
import type { CreateProjectInput, UpdateProjectInput } from './projects.schemas.js';

// Parameters for a paginated, sorted list query.
export interface ListProjectsParams {
  where: Prisma.ProjectWhereInput;
  orderBy: Prisma.ProjectOrderByWithRelationInput;
  skip: number;
  take: number;
}

export const projectsRepository = {
  // Returns one page of projects plus the total count, in a single round trip.
  list(params: ListProjectsParams) {
    return prisma.$transaction([
      prisma.project.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
      }),
      prisma.project.count({ where: params.where }),
    ]);
  },

  findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  },

  create(ownerId: string, data: CreateProjectInput) {
    return prisma.project.create({ data: { ...data, ownerId } });
  },

  update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
