import { z } from 'zod';

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

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
