// Business logic for tasks. Knows nothing about HTTP or how data is stored.
// Input is already validated by the Zod `validate` middleware before it reaches here.
import { tasksRepository } from './tasks.repository.js';
import { NotFoundError } from '../../shared/errors/index.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schemas.js';

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
