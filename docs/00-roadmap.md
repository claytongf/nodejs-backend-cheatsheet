# 00 · Learning Roadmap

A suggested path through this repository, from zero to a job-ready Node.js backend developer.

## How to use this repo

1. Read the chapter in `docs/`.
2. Run the matching example in `examples/`.
3. Find the same idea inside the real API in `src/`.
4. Keep the matching `cheatsheets/` file open for quick recall.
5. Answer the interview questions at the end of each chapter.

If you want a path tailored to your background, start with
[Study Guide](study-guide.md). It provides tracks for beginners, Laravel/PHP developers,
junior interviews, mid-level interviews, and fast review.

## The path

### Stage 1 — Foundations

- [01 · Node.js runtime](01-nodejs-runtime.md) — what Node is and how it runs your code.
- [02 · JavaScript & TypeScript](02-javascript-typescript.md) — the language you write the backend in.
- [03 · HTTP & REST APIs](03-http-and-rest-apis.md) — how the web talks.

### Stage 2 — Building APIs

- [04 · Express fundamentals](04-express-fundamentals.md)
- [05 · Project architecture](05-project-architecture.md)
- [06 · Async/await, promises & the event loop](06-async-await-promises-event-loop.md)

### Stage 3 — Correctness & data

- [07 · Validation with Zod](07-validation-with-zod.md)
- [08 · Error handling](08-error-handling.md)
- [09 · Database: Prisma & PostgreSQL](09-database-prisma-postgresql.md)

### Stage 4 — Security

- [10 · Authentication (JWT)](10-authentication-jwt.md)
- [11 · Authorization (roles & permissions)](11-authorization-roles-permissions.md)
- [13 · Security best practices](13-security-best-practices.md)

### Stage 5 — Quality & production

- [12 · Testing (Jest & Supertest)](12-testing-jest-supertest.md)
- [14 · Queues, workers & Redis](14-queues-workers-redis.md)
- [15 · Docker & production](15-docker-and-production.md)

### Stage 6 — Going further

- [16 · NestJS overview](16-nestjs-overview.md)
- [17 · Laravel → Node.js](17-laravel-to-nodejs.md)
- [18 · Interview questions](18-interview-questions.md)

## Why this order matters

You cannot debug an API if you do not understand HTTP. You cannot secure it if you do
not understand auth. Each stage unlocks the next — this is exactly the order in which
real teams onboard junior backend developers.

## For Laravel developers

You already know MVC, migrations, validation, middleware, and auth — you just learned
them in PHP. Skim Stages 1–2 quickly, then focus on the **differences**: the event loop
(06), Prisma vs Eloquent (09), and JWT vs Sanctum (10). The bridge chapter is
[17 · Laravel → Node.js](17-laravel-to-nodejs.md).

## Study checklist

- [ ] I can explain what Node.js is and where it runs.
- [ ] I can build and test a small Express API.
- [ ] I can model data and query it with Prisma.
- [ ] I can secure an endpoint with JWT + roles.
- [ ] I can write an integration test with Supertest.
- [ ] I can run the whole stack with Docker Compose.
- [ ] I can choose a study track from [Study Guide](study-guide.md).

## Interview questions

**Q: How long does it take to learn Node.js backend?**
A: With prior programming experience, the core (HTTP, Express, a database, auth, tests)
takes a few focused weeks. Mastery of production concerns takes longer and comes from
shipping real services.

**Q: Do I need to learn TypeScript or is plain JavaScript fine?**
A: Plain JS works, but most professional Node.js backends use TypeScript for safety and
tooling. This repo uses strict TypeScript throughout.
