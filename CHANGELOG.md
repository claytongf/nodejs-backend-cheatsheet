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

## [0.1.0] - 2026-06-15

- First public scaffold of the learning repository.
