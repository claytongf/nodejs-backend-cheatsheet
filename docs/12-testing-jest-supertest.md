# 12 · Testing (Jest & Supertest)

## What it is

**Jest** is a test runner and assertion library. **Supertest** sends HTTP requests to your
Express app **in-process** (no real network), so you can test endpoints end-to-end:
request in, response and database effects out.

## Why it matters in backend development

Tests let you change code without fear, document expected behavior, and catch regressions
in CI. Integration tests over HTTP give the most confidence per line because they exercise
routing, validation, auth, services, and the database together.

## How it appears in real Node.js jobs

You will write tests for each endpoint (happy path + failure path), run them in CI on every
PR, and keep a separate test database. Knowing the difference between unit and integration
tests is a common interview topic.

## Simple code example

```ts
import request from 'supertest';
import { app } from '../app.js';

describe('POST /auth/register', () => {
  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Ada', email: 'ada@x.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('ada@x.com');
    expect(res.body.passwordHash).toBeUndefined(); // never leak the hash
  });

  it('rejects invalid input with 422', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'x' });
    expect(res.status).toBe(422);
  });
});
```

## Practical example from this project

Tests live in `src/tests/`. Because `app.ts` is separate from `server.ts`, Supertest
imports the app directly (`request(app)`) without opening a port. The suite registers a
user, logs in to get a JWT, then exercises protected project/task endpoints — covering
auth, validation, and ownership.

## Laravel comparison

| Laravel | This project |
| --- | --- |
| PHPUnit / Pest | Jest |
| `$this->post('/users', ...)` | `request(app).post('/users')` |
| `assertStatus(201)` | `expect(res.status).toBe(201)` |
| `RefreshDatabase` trait | a clean test DB / truncate between tests |

The feel is nearly identical — fire an HTTP request, assert on the response.

## Common beginner mistakes

- Testing against the dev/prod database instead of a dedicated test DB.
- Tests depending on each other's leftover data (no cleanup between tests).
- Only testing happy paths; never testing `401`/`403`/`422`.
- Mocking so much that the test no longer proves anything.
- Forgetting to disconnect Prisma, leaving the test process hanging.

## Best practices

- Use a separate test database (CI sets `DATABASE_URL`).
- Reset state between tests (truncate tables or use transactions).
- Test both success and failure paths for each endpoint.
- Prefer integration tests for endpoints; add unit tests for tricky pure logic.
- Run tests in CI on every push/PR.

## Study checklist

- [ ] I can write a Supertest request against the app.
- [ ] I can assert on status code and body.
- [ ] I know how to isolate the test database.
- [ ] I can test an authenticated, ownership-protected route.

## Interview questions

**Q: Unit vs integration test?**
A: A unit test checks one function in isolation; an integration test checks several pieces
together (e.g. an HTTP endpoint through routing, service, and DB).

**Q: Why use Supertest instead of hitting a running server?**
A: It runs the Express app in-process — faster, no port conflicts, and easy to import in
tests.

**Q: How do you keep tests independent?**
A: Reset the database between tests (truncate or wrap each test in a transaction) and avoid
shared mutable state.
