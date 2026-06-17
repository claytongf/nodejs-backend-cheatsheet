# Debugging Challenges

Use these drills to practice reading failures and finding root causes.

## Challenge 1: Cross-User Task Access

Symptom: a user can fetch another user's task by ID.

Investigate:

- Was the wrong token used in the test?
- Does the route require authentication?
- Does the service call an ownership check?
- Does the repository return enough data to authorize?

Strong fix:

- Add a regression test for cross-user task access.
- Keep admin access working.
- Return `403` for authenticated but unauthorized users.

## Challenge 2: Tests Pass Locally but Fail in CI

Symptom: Prisma tests fail because tables do not exist.

Investigate:

- Did CI apply migrations?
- Is `DATABASE_URL` pointing to the test database?
- Does Prisma config load the expected env file?
- Is the database service healthy before migrations run?

Strong fix:

- Align local setup with CI.
- Document the setup command.
- Avoid relying on dev database state.

## Challenge 3: Validation Does Not Catch Bad Input

Symptom: `POST /tasks` accepts malformed input.

Investigate:

- Is the route using the validation middleware?
- Is the schema checking the right field?
- Is the controller reading from validated body?
- Does the test assert `422`?

Strong fix:

- Add a focused invalid-input test.
- Keep validation in schemas, not controllers.

## Challenge 4: Password Hash Leaks

Symptom: an auth response includes `passwordHash`.

Investigate:

- Which repository method returns the user?
- Does the service strip sensitive fields?
- Does the test assert the hash is absent?
- Does Swagger show the safe response shape?

Strong fix:

- Strip sensitive fields in the service.
- Add regression tests.
- Keep API docs aligned.
