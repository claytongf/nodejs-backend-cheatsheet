import { z } from 'zod';

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
