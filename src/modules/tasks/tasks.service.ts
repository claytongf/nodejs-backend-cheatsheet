// Business logic for tasks. Knows nothing about HTTP or how data is stored.
// The manual input check here is replaced by Zod validation in a later phase.
import { tasksRepository } from './tasks.repository.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/index.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.types.js';

export const tasksService = {
  list() {
    return tasksRepository.findAll();
  },

  getById(id: string) {
    const task = tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  },

  create(input: CreateTaskInput) {
    if (!input.title || input.title.trim().length < 2) {
      throw new BadRequestError('title is required and must be at least 2 characters');
    }
    return tasksRepository.create(input);
  },

  update(id: string, input: UpdateTaskInput) {
    this.getById(id); // ensures it exists -> 404 otherwise
    return tasksRepository.update(id, input);
  },

  complete(id: string) {
    this.getById(id);
    return tasksRepository.update(id, { status: 'DONE' });
  },

  remove(id: string) {
    this.getById(id);
    tasksRepository.delete(id);
  },
};
