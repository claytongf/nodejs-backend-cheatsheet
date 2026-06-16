// Data access for tasks. The ONLY layer that knows how tasks are stored.
// For now it is an in-memory store; a later phase swaps this for Prisma + PostgreSQL
// WITHOUT changing the service or controller above it. That is the point of the layering.
import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../shared/errors/index.js';
import type { Task } from './tasks.types.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schemas.js';

const store = new Map<string, Task>();

export const tasksRepository = {
  findAll(): Task[] {
    return [...store.values()];
  },

  findById(id: string): Task | undefined {
    return store.get(id);
  },

  create(input: CreateTaskInput): Task {
    const now = new Date();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? null,
      status: 'TODO',
      createdAt: now,
      updatedAt: now,
    };
    store.set(task.id, task);
    return task;
  },

  update(id: string, input: UpdateTaskInput): Task {
    const existing = store.get(id);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }
    const updated: Task = {
      ...existing,
      title: input.title ?? existing.title,
      // Distinguish "not provided" (undefined -> keep) from "clear it" (null -> set null).
      // `??` cannot express this, since it would also fall back to existing on null.
      description: input.description === undefined ? existing.description : input.description,
      status: input.status ?? existing.status,
      updatedAt: new Date(),
    };
    store.set(id, updated);
    return updated;
  },

  delete(id: string): void {
    store.delete(id);
  },
};
