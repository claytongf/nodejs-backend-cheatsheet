// Business logic + ownership authorization for projects.
import { projectsRepository } from './projects.repository.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type { AuthUser } from '../../shared/types/index.js';
import type { CreateProjectInput, UpdateProjectInput } from './projects.schemas.js';
import type { Project } from './projects.types.js';

// Shared ownership check: a user may only access their own projects (admins may access any).
async function getOwnedProject(id: string, actor: AuthUser): Promise<Project> {
  const project = await projectsRepository.findById(id);
  if (!project) {
    throw new NotFoundError('Project not found');
  }
  if (project.ownerId !== actor.id && actor.role !== 'ADMIN') {
    throw new ForbiddenError();
  }
  return project;
}

export const projectsService = {
  create(actor: AuthUser, data: CreateProjectInput) {
    return projectsRepository.create(actor.id, data);
  },

  list(actor: AuthUser) {
    // Admins see everything; regular users see only their own.
    return actor.role === 'ADMIN'
      ? projectsRepository.findMany()
      : projectsRepository.findByOwner(actor.id);
  },

  getById(id: string, actor: AuthUser) {
    return getOwnedProject(id, actor);
  },

  async update(id: string, data: UpdateProjectInput, actor: AuthUser) {
    await getOwnedProject(id, actor);
    return projectsRepository.update(id, data);
  },

  async remove(id: string, actor: AuthUser) {
    await getOwnedProject(id, actor);
    await projectsRepository.delete(id);
  },
};
