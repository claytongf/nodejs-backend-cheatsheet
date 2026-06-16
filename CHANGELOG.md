# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project scaffold: README, docs (00–18), cheatsheets, and runnable examples.
- Task Manager API with `auth`, `users`, `projects`, and `tasks` modules.
- TypeScript (strict), Express, Prisma + PostgreSQL, Zod, JWT, bcrypt, pino.
- Centralized error handling and Zod validation middleware.
- Role-based authorization (`admin`/`user`) and ownership checks.
- Jest + Supertest integration tests.
- Docker Compose for PostgreSQL and Redis.
- GitHub CI workflow (lint, build, test) and issue/PR templates.
- Minimal browser interfaces: a static landing page at `GET /` and interactive
  Swagger UI (OpenAPI) at `GET /api-docs` covering all endpoints with request/response
  examples, Bearer auth, and error responses.

### Changed

- Upgraded Prisma from 5.x to 7.x. The connection URL moved out of `schema.prisma`
  into `prisma.config.ts`, and the application now connects through the PostgreSQL
  driver adapter (`@prisma/adapter-pg`). The `package.json#prisma` key was replaced by
  `prisma.config.ts`.

### Security

- Resolved all `npm audit` advisories (19 moderate) by pinning the transitive
  `js-yaml` dependency to the patched `^4.2.0` via a `package.json` override.

## [0.1.0] - 2026-06-15

- First public scaffold of the learning repository.
