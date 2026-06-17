// Business logic + ownership authorization for tasks.
import type { Prisma } from '@prisma/client';
import { tasksRepository } from './tasks.repository.js';
import { projectsRepository } from '../projects/projects.repository.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import { toSkipTake, toPage } from '../../shared/utils/pagination.js';
import type { AuthUser } from '../../shared/types/index.js';
import type { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from './tasks.schemas.js';
import type { Task } from './tasks.types.js';

// Ensures the task exists and the actor may access it.
async function getOwnedTask(id: string, actor: AuthUser): Promise<Task> {
  const task = await tasksRepository.findById(id);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  if (task.ownerId !== actor.id && actor.role !== 'ADMIN') {
    throw new ForbiddenError();
  }
  return task;
}

export const tasksService = {
  async create(actor: AuthUser, data: CreateTaskInput) {
    // A task must belong to a project the actor owns (or admin).
    const project = await projectsRepository.findById(data.projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    if (project.ownerId !== actor.id && actor.role !== 'ADMIN') {
      throw new ForbiddenError('You cannot add tasks to this project');
    }

    return tasksRepository.create({
      title: data.title,
      description: data.description,
      status: data.status,
      projectId: data.projectId,
      ownerId: actor.id,
    });
  },

  async list(actor: AuthUser, query: ListTasksQuery) {
    // Admins see all tasks; everyone else only their own. Optional status filter.
    const where: Prisma.TaskWhereInput = {
      ...(actor.role === 'ADMIN' ? {} : { ownerId: actor.id }),
      ...(query.status ? { status: query.status } : {}),
    };

    const result = await tasksRepository.list({
      where,
      orderBy: { [query.sort]: query.order },
      ...toSkipTake(query),
    });

    // A consistent envelope so clients always know how to paginate.
    return toPage(result, query);
  },

  getById(id: string, actor: AuthUser) {
    return getOwnedTask(id, actor);
  },

  async update(id: string, data: UpdateTaskInput, actor: AuthUser) {
    await getOwnedTask(id, actor);
    return tasksRepository.update(id, data);
  },

  async complete(id: string, actor: AuthUser) {
    await getOwnedTask(id, actor);
    return tasksRepository.setStatus(id, 'DONE');
  },

  async remove(id: string, actor: AuthUser) {
    await getOwnedTask(id, actor);
    await tasksRepository.delete(id);
  },
};
