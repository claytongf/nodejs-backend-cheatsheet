// Business logic for tasks. Knows nothing about HTTP or how data is stored.
// Input is already validated by the Zod `validate` middleware before it reaches here.
// Now async, because the repository talks to the database.
import { tasksRepository } from './tasks.repository.js';
import { NotFoundError } from '../../shared/errors/index.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schemas.js';

export const tasksService = {
  list() {
    return tasksRepository.findAll();
  },

  async getById(id: string) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  },

  create(input: CreateTaskInput) {
    return tasksRepository.create(input);
  },

  async update(id: string, input: UpdateTaskInput) {
    await this.getById(id); // ensures it exists -> 404 otherwise
    return tasksRepository.update(id, input);
  },

  async complete(id: string) {
    await this.getById(id);
    return tasksRepository.update(id, { status: 'DONE' });
  },

  async remove(id: string) {
    await this.getById(id);
    await tasksRepository.delete(id);
  },
};
