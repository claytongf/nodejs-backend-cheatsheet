# Live Coding Prompts

These prompts are based on realistic changes to the Task Manager API.

## Prompt 1: Add Task Priority

Implement task priority with `LOW`, `MEDIUM`, and `HIGH`.

Expected discussion:

- Prisma enum and migration.
- Zod validation.
- API response shape.
- Tests for default and custom values.

Related lab: [01 · Add task priority](../labs/01-add-task-priority.md)

## Prompt 2: Add Task Filtering

Add `GET /tasks?status=DONE` and keep ownership rules intact.

Expected discussion:

- Query schema.
- Repository query shape.
- Ownership filtering.
- Tests for cross-user isolation.

Related lab: [02 · Filter and paginate tasks](../labs/02-filter-and-pagination.md)

## Prompt 3: Add a User Profile Field

Add an optional `bio` field to users.

Expected discussion:

- Migration.
- Update schema.
- Mass-assignment safety.
- Response shape.
- Tests for self-update and forbidden update.

## Prompt 4: Add Admin User Search

Allow admins to search users by email substring.

Expected discussion:

- Admin-only route behavior.
- Query validation.
- Case sensitivity.
- Avoiding password hash leaks.

## Live Coding Evaluation

A good solution:

- Starts with a small plan.
- Updates the right layers.
- Adds or updates tests.
- Handles invalid input.
- Preserves existing auth rules.
- Runs validation before calling the task done.
