# 02 · Filter and Paginate Tasks

Level: Intermediate

## Context

`GET /tasks` **already** paginates (`page`, `limit`), filters by `status`, and sorts
(`sort`, `order`), returning a `{ data, total, page, limit }` envelope — see
[tasks.schemas.ts](../src/modules/tasks/tasks.schemas.ts),
[tasks.service.ts](../src/modules/tasks/tasks.service.ts), and
[tasks.repository.ts](../src/modules/tasks/tasks.repository.ts), and chapter
[19 · Performance & data access](../docs/19-performance-and-data-access.md).

Your job is to **extend** it: add a `projectId` filter, and study the existing code so you
can explain every part of it.

## Requirements

- Add an optional `projectId` query filter to the existing `listTasksQuerySchema`.
- Wire it into the repository `where` clause (alongside the existing `status` filter).
- Keep regular users scoped to their own tasks; keep admins able to see all tasks.
- Keep the existing `{ data, total, page, limit }` envelope.

## Likely Files

- `src/modules/tasks/tasks.routes.ts`
- `src/modules/tasks/tasks.controller.ts`
- `src/modules/tasks/tasks.schemas.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/modules/tasks/tasks.repository.ts`
- `src/tests/tasks.test.ts`
- `src/config/swagger.ts`

## Suggested Steps

1. Read the existing `listTasksQuerySchema` and the service/repository `list` flow first.
2. Add `projectId: z.string().uuid().optional()` to the query schema.
3. Include it in the service `where` clause only when present.
4. Add a test for `GET /tasks?projectId=<id>` and an invalid-`projectId` (`422`) case.
5. Update the Swagger query parameters for `GET /tasks` in `src/config/swagger.ts`.

## Acceptance Criteria

- `GET /tasks?status=DONE` returns only done tasks (already works — keep it working).
- `GET /tasks?projectId=<id>` returns only tasks from that project.
- `GET /tasks?page=1&limit=10` returns the `{ data, total, page, limit }` envelope.
- A user cannot discover another user's tasks through filters.
- Invalid query values (e.g. `projectId=not-a-uuid`, `limit=999`) return `422`.

## Interview Follow-Ups

- Why should ownership filtering happen server-side even if the client sends filters?
- What are the trade-offs between offset pagination and cursor pagination?
- Where should pagination metadata be shaped: controller, service, or repository?
