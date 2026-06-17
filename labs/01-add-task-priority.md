# 01 · Add Task Priority

Level: Beginner

## Context

Tasks currently have a title, optional description, status, project, owner, and timestamps.
Real task systems usually also track priority.

## Requirements

- Add a `priority` field to tasks.
- Support values `LOW`, `MEDIUM`, and `HIGH`.
- Default new tasks to `MEDIUM`.
- Allow clients to set priority on create and update.
- Return priority in task responses and Swagger docs.

## Likely Files

- `prisma/schema.prisma`
- `src/modules/tasks/tasks.schemas.ts`
- `src/modules/tasks/tasks.repository.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/modules/tasks/tasks.types.ts`
- `src/config/swagger.ts`
- `src/tests/tasks.test.ts`

## Suggested Steps

1. Add a Prisma enum for priority.
2. Add the field to the `Task` model.
3. Create and apply a migration.
4. Update Zod schemas.
5. Update task create/update logic if needed.
6. Add tests for default priority and custom priority.
7. Update Swagger examples.

## Acceptance Criteria

- Creating a task without priority returns `MEDIUM`.
- Creating a task with `HIGH` persists and returns `HIGH`.
- Updating priority works for the task owner.
- Invalid priority returns `422`.
- Existing task tests still pass.

## Interview Follow-Ups

- Why should validation be updated before service logic trusts the new field?
- Why does this change require both database and API updates?
- What could go wrong if Prisma and Zod enums get out of sync?
