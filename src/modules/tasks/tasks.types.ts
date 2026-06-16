// Domain types for the tasks module.
// We re-export the Prisma-generated types so there is one source of truth for the
// stored shape. The CreateTaskInput / UpdateTaskInput types are inferred from the
// Zod schemas in tasks.schemas.ts.
export type { Task, TaskStatus } from '@prisma/client';
