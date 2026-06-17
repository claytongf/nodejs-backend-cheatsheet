// Shared pagination helpers so every list endpoint behaves identically
// (see docs/20-api-design-at-scale.md — "one pagination envelope across all endpoints").
import { z } from 'zod';

// Base query schema. Query strings are always strings, so we coerce. The limit is
// capped so a client can never request an unbounded page. Feature modules extend this
// with their own filters and sort fields (e.g. `paginationSchema.extend({ ... })`).
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// The list response envelope returned by every paginated endpoint.
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Turn page/limit into Prisma's skip/take.
export function toSkipTake(query: PaginationQuery): { skip: number; take: number } {
  return { skip: (query.page - 1) * query.limit, take: query.limit };
}

// Build the response envelope from a repository's [rows, total] result.
export function toPage<T>([data, total]: [T[], number], query: PaginationQuery): Paginated<T> {
  return { data, total, page: query.page, limit: query.limit };
}
