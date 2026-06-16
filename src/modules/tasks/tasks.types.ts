// Domain type for the tasks module.
// The CreateTaskInput / UpdateTaskInput types are inferred from the Zod schemas
// in tasks.schemas.ts (single source of truth for validation and types).
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
