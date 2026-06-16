import type { TaskStatus } from '@prisma/client';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
