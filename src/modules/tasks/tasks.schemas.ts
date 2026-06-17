import { z } from 'zod';
import { paginationSchema } from '../../shared/utils/pagination.js';

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().max(1000).optional(),
  projectId: z.string().uuid(),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(2).optional(),
    description: z.string().max(1000).nullable().optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

// Query parameters for GET /tasks: shared pagination (page/limit) plus a task-specific
// status filter and sort options.
export const listTasksQuerySchema = paginationSchema.extend({
  status: taskStatusSchema.optional(),
  sort: z.enum(['createdAt', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
