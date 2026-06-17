# 05 · Debug a Broken Test

Level: Intermediate

## Context

Backend engineers spend a lot of time reading failures, not just writing new code. This
lab is a debugging drill.

## Scenario

A task ownership test starts failing after a refactor. The API returns `200` where the
test expected `403`.

## Requirements

- Reproduce the failure.
- Identify whether the bug is in the test setup, route middleware, service ownership
  check, or repository query.
- Fix the root cause.
- Add one regression test that would have caught the issue earlier.

## Likely Files

- `src/tests/tasks.test.ts`
- `src/tests/helpers.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/modules/tasks/tasks.repository.ts`
- `src/middlewares/auth.middleware.ts`

## Suggested Debugging Process

1. Read the failing assertion.
2. Confirm which user owns the project and task.
3. Confirm which token is used for the request.
4. Trace the request through routes, controller, service, and repository.
5. Check whether the service loads the correct task before authorizing.
6. Fix the smallest responsible layer.

## Acceptance Criteria

- The original failing test passes.
- A cross-user access regression test exists.
- The fix does not weaken admin access.
- The full test suite passes.

## Interview Follow-Ups

- How do you distinguish a bad test from a real authorization bug?
- Why is an integration test useful for ownership checks?
- What logs or debugging output would help without leaking sensitive data?
