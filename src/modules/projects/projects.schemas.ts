import { z } from 'zod';
import { paginationSchema } from '../../shared/utils/pagination.js';

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(500).optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(2).optional(),
    description: z.string().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

// Query parameters for GET /projects: shared pagination plus sort options.
export const listProjectsQuerySchema = paginationSchema.extend({
  sort: z.enum(['createdAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
