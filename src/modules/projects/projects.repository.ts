// The only place that touches prisma.project.
import { prisma } from '../../database/prisma.js';
import type { CreateProjectInput, UpdateProjectInput } from './projects.schemas.js';

export const projectsRepository = {
  findMany() {
    return prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findByOwner(ownerId: string) {
    return prisma.project.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } });
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
