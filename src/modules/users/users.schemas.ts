import { z } from 'zod';
import { paginationSchema } from '../../shared/utils/pagination.js';

// Query parameters for GET /users (admin only): shared pagination plus sort options.
export const listUsersQuerySchema = paginationSchema.extend({
  sort: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// Partial update: any provided field must be valid; at least one is required.
export const updateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
