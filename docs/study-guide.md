# Study Guide

Use this guide to choose a learning track. The repository is intentionally reusable: the
same source code can support first-time study, interview review, portfolio practice, and
Laravel-to-Node.js migration.

## How the Learning System Fits Together

For each topic, study in this order:

1. Read the matching chapter in `docs/`.
2. Run the isolated example in `examples/` when one exists.
3. Find the same pattern in the real API under `src/`.
4. Use the matching cheatsheet for quick recall.
5. Complete a related lab when available.
6. Practice explaining the idea with interview questions.

This flow keeps learning active: read, run, inspect, change, test, and explain.

## Track 1: Beginner Backend Path

Best for learners who know basic programming but are new to backend APIs.

### Sequence

1. [01 · Node.js runtime](01-nodejs-runtime.md)
2. [02 · JavaScript & TypeScript](02-javascript-typescript.md)
3. [03 · HTTP & REST APIs](03-http-and-rest-apis.md)
4. [04 · Express fundamentals](04-express-fundamentals.md)
5. [05 · Project architecture](05-project-architecture.md)
6. [07 · Validation with Zod](07-validation-with-zod.md)
7. [08 · Error handling](08-error-handling.md)
8. [09 · Database: Prisma & PostgreSQL](09-database-prisma-postgresql.md)
9. [10 · Authentication (JWT)](10-authentication-jwt.md)
10. [11 · Authorization](11-authorization-roles-permissions.md)
11. [12 · Testing](12-testing-jest-supertest.md)

### Practice Target

After this track, you should be able to add a small field to a model, expose it in the API,
validate it, test it, and explain the full request flow.

## Track 2: Laravel/PHP Developer Path

Best for developers who already understand MVC, migrations, validation, middleware, and
auth from Laravel.

### Sequence

1. [17 · Laravel to Node.js](17-laravel-to-nodejs.md)
2. [01 · Node.js runtime](01-nodejs-runtime.md)
3. [06 · Async/await, promises & the event loop](06-async-await-promises-event-loop.md)
4. [05 · Project architecture](05-project-architecture.md)
5. [09 · Database: Prisma & PostgreSQL](09-database-prisma-postgresql.md)
6. [10 · Authentication (JWT)](10-authentication-jwt.md)
7. [11 · Authorization](11-authorization-roles-permissions.md)
8. [12 · Testing](12-testing-jest-supertest.md)
9. [15 · Docker & production](15-docker-and-production.md)

### Practice Target

After this track, you should be able to translate Laravel concepts into this codebase:
routes, controllers, services, repositories, Zod schemas, Prisma migrations, middleware,
and integration tests.

## Track 3: Junior Interview Path

Best for first backend interviews.

### Sequence

1. [03 · HTTP & REST APIs](03-http-and-rest-apis.md)
2. [04 · Express fundamentals](04-express-fundamentals.md)
3. [07 · Validation with Zod](07-validation-with-zod.md)
4. [08 · Error handling](08-error-handling.md)
5. [10 · Authentication (JWT)](10-authentication-jwt.md)
6. [12 · Testing](12-testing-jest-supertest.md)
7. [18 · Interview questions](18-interview-questions.md)

### Practice Target

You should be able to answer common questions clearly and point to one real file in this
repo for each answer.

## Track 4: Mid-Level Interview Path

Best for interviews that expect architecture, trade-off, and debugging skills.

### Sequence

1. [05 · Project architecture](05-project-architecture.md)
2. [06 · Async/await, promises & the event loop](06-async-await-promises-event-loop.md)
3. [09 · Database: Prisma & PostgreSQL](09-database-prisma-postgresql.md)
4. [11 · Authorization](11-authorization-roles-permissions.md)
5. [12 · Testing](12-testing-jest-supertest.md)
6. [13 · Security best practices](13-security-best-practices.md)
7. [15 · Docker & production](15-docker-and-production.md)
8. [18 · Interview questions](18-interview-questions.md)

### Practice Target

You should be able to explain why the project uses layered modules, how ownership checks
prevent IDOR, how tests isolate state, and what you would improve before production.

## Track 5: Fast Review Path

Best when you already know backend development and need quick recall.

### Sequence

1. Read [00 · Roadmap](00-roadmap.md).
2. Skim all files in `cheatsheets/`.
3. Read [18 · Interview questions](18-interview-questions.md).
4. Run the app and inspect Swagger at `/api-docs`.
5. Run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`.

### Practice Target

You should be able to explain the project in two minutes, then defend the architecture in
more depth when asked follow-up questions.

## Weekly Study Rhythm

Use this rhythm when studying over several weeks:

1. **Day 1:** read one chapter and run the matching example.
2. **Day 2:** trace the same idea in `src/`.
3. **Day 3:** implement a small change or lab.
4. **Day 4:** write or update a test.
5. **Day 5:** answer interview questions out loud.
6. **Day 6:** review cheatsheets and fix weak areas.
7. **Day 7:** rest or do a mock interview.

## Self-Assessment

For each topic, rate yourself:

| Level | Signal |
| --- | --- |
| 1 | I can recognize the concept when reading code. |
| 2 | I can explain the concept in simple terms. |
| 3 | I can use the concept with guidance. |
| 4 | I can implement it independently and test it. |
| 5 | I can explain trade-offs and debug failures. |

Aim for level 4 on junior topics and level 5 on topics you plan to discuss deeply in an
interview.
