// 08 · Validating untrusted input with Zod.
// Run: npx tsx examples/08-zod-validation/index.ts

import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// The TypeScript type is inferred from the schema — single source of truth.
type CreateTaskInput = z.infer<typeof createTaskSchema>;

function tryValidate(input: unknown) {
  const result = createTaskSchema.safeParse(input);
  if (!result.success) {
    console.log('❌ invalid:', result.error.flatten().fieldErrors);
    return;
  }
  const data: CreateTaskInput = result.data;
  console.log('✅ valid:', data);
}

tryValidate({ title: 'Write the Zod chapter' }); // ok, priority defaults to medium
tryValidate({ title: 'no', priority: 'urgent' }); // two errors
