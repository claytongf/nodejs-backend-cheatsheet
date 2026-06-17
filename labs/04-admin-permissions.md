# 04 · Strengthen Admin Permissions

Level: Intermediate

## Context

The project already has `USER` and `ADMIN` roles. This lab makes role behavior more
explicit and easier to defend in interviews.

## Requirements

- Review every admin-only or owner/admin endpoint.
- Add missing tests for admin access where coverage is thin.
- Add tests proving regular users cannot perform admin-only actions.
- Make error messages consistent for forbidden actions.

## Likely Files

- `src/middlewares/auth.middleware.ts`
- `src/modules/users/users.routes.ts`
- `src/modules/users/users.service.ts`
- `src/modules/projects/projects.service.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/tests/auth.test.ts`
- `src/tests/tasks.test.ts`
- New or expanded user tests under `src/tests/`

## Suggested Steps

1. Map each protected endpoint to its permission rule.
2. Add tests for admin-only user listing/deletion.
3. Add tests for owner/admin project access.
4. Add tests for owner/admin task access.
5. Verify `401` vs `403` behavior.

## Acceptance Criteria

- Missing token returns `401`.
- Invalid token returns `401`.
- Authenticated but unauthorized user returns `403`.
- Admin can perform documented admin actions.
- Regular users cannot access admin-only behavior.

## Interview Follow-Ups

- What is the difference between authentication and authorization?
- What is IDOR, and where does this project prevent it?
- Why should permission checks live in services instead of controllers?
