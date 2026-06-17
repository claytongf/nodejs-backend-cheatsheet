# 02 · Filter and Paginate Tasks

Level: Intermediate

## Context

`GET /tasks` currently returns all visible tasks for the authenticated user. That is fine
for a small demo, but real APIs need filtering and pagination.

## Requirements

- Add optional query filters for `status` and `projectId`.
- Add pagination with `page` and `limit`.
- Keep regular users scoped to their own tasks.
- Keep admins able to see all tasks.
- Return pagination metadata.

## Likely Files

- `src/modules/tasks/tasks.routes.ts`
- `src/modules/tasks/tasks.controller.ts`
- `src/modules/tasks/tasks.schemas.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/modules/tasks/tasks.repository.ts`
- `src/tests/tasks.test.ts`
- `src/config/swagger.ts`

## Suggested Steps

1. Add a Zod schema for query parameters.
2. Parse `page` and `limit` into numbers with safe defaults.
3. Push filtering and pagination into the repository layer.
4. Return `{ data, meta }` from the list endpoint.
5. Add tests for filtering, pagination, and ownership.
6. Update Swagger response examples.

## Acceptance Criteria

- `GET /tasks?status=DONE` returns only done tasks.
- `GET /tasks?projectId=<id>` returns only tasks from that project.
- `GET /tasks?page=1&limit=10` returns pagination metadata.
- A user cannot discover another user's tasks through filters.
- Invalid query values return `422`.

## Interview Follow-Ups

- Why should ownership filtering happen server-side even if the client sends filters?
- What are the trade-offs between offset pagination and cursor pagination?
- Where should pagination metadata be shaped: controller, service, or repository?
