# Learning Index

This index maps the learning system across chapters, examples, labs, interview prep, and
real source files. Use it when studying or when adding new material.

## Core Map

| Topic | Chapter | Example | Practice | Interview Prep | Source Files |
| --- | --- | --- | --- | --- | --- |
| Node runtime | [01](01-nodejs-runtime.md) | `examples/01-node-core` | Fast review path | `question-bank.md` runtime section | `src/server.ts` |
| TypeScript | [02](02-javascript-typescript.md) | `examples/02-modules` | Add typed fields in labs | Architecture/coding prompts | `src/**/*.types.ts`, `src/**/*.schemas.ts` |
| HTTP and REST | [03](03-http-and-rest-apis.md) | `examples/04-http-server` | Labs 01, 02 | HTTP questions | `src/modules/*/*.routes.ts` |
| Express | [04](04-express-fundamentals.md) | `examples/05-express-routes`, `examples/06-middlewares` | Endpoint labs | Live coding prompts | `src/app.ts`, `src/middlewares/` |
| Architecture | [05](05-project-architecture.md) | Feature modules in `src/` | Labs 01, 04 | Architecture questions | `src/modules/` |
| Async/event loop | [06](06-async-await-promises-event-loop.md) | `examples/03-async-await` | Debugging labs | Runtime questions | Services and repositories |
| Validation | [07](07-validation-with-zod.md) | `examples/08-zod-validation` | Labs 01, 02 | Validation questions | `src/modules/*/*.schemas.ts` |
| Error handling | [08](08-error-handling.md) | `examples/07-error-handling` | Debugging labs | Debugging challenges | `src/shared/errors/`, `src/middlewares/error.middleware.ts` |
| Database | [09](09-database-prisma-postgresql.md) | `examples/09-prisma-crud` | Labs 01, 02 | Database questions | `prisma/schema.prisma`, repositories |
| Authentication | [10](10-authentication-jwt.md) | Auth module | Lab 03 | Auth questions | `src/modules/auth/`, `src/shared/utils/jwt.ts` |
| Authorization | [11](11-authorization-roles-permissions.md) | Protected modules | Lab 04 | IDOR questions | Services and auth middleware |
| Testing | [12](12-testing-jest-supertest.md) | `examples/10-tests` | Lab 05 | Testing questions | `src/tests/` |
| Security | [13](13-security-best-practices.md) | App middleware | Lab 06 | Security questions | `src/app.ts`, `src/config/env.ts` |
| Queues | [14](14-queues-workers-redis.md) | Redis service in Compose | System design reminders | System design prompts | `docker-compose.yml` |
| Docker/production | [15](15-docker-and-production.md) | Docker Compose | Lab 06 | Production questions | `docker-compose.yml`, `.github/workflows/ci.yml` |
| NestJS | [16](16-nestjs-overview.md) | N/A | Compare architecture | Architecture trade-offs | `src/modules/` |
| Laravel bridge | [17](17-laravel-to-nodejs.md) | N/A | Laravel track | Behavioral/project answers | Entire repo |
| Interview review | [18](18-interview-questions.md) | N/A | Mock interviews | All interview prep | Entire repo |
| Performance & data | [19](19-performance-and-data-access.md) | Pagination on `GET /tasks` | Cookbook #8, Lab 02 | Database/scaling questions | `tasks.repository.ts`, `prisma/schema.prisma` |
| API design at scale | [20](20-api-design-at-scale.md) | Shared envelope on all list endpoints | Senior track | System design prompts | `src/shared/utils/pagination.ts`, `config/swagger.ts` |
| Reliability | [21](21-reliability-and-resilience.md) | Graceful shutdown, rate limit | Lab 08 | Resilience questions | `src/server.ts`, `src/app.ts` |
| Config & secrets | [22](22-configuration-and-secrets.md) | Startup env validation | Cookbook #10 | Security/config questions | `src/config/env.ts`, `.env.example` |
| Observability | [23](23-observability.md) | Correlation id + pino | Lab 09 | Observability questions | `src/app.ts`, `src/config/logger.ts` |
| Caching | [24](24-caching.md) | `TtlCache` utility | Lab 07 | Caching questions | `src/shared/utils/cache.ts` |
| Scaling & architecture | [25](25-scaling-and-architecture.md) | Layered modules | Senior track | Architecture trade-offs | `src/modules/`, `src/middlewares/` |

## Learning Assets

| Area | Purpose |
| --- | --- |
| `docs/cookbook.md` | Task-oriented "how do I X" recipes that point to real files |
| `docs/` | Deep explanations and learning paths |
| `cheatsheets/` | Fast recall |
| `examples/` | Small isolated examples |
| `labs/` | Practical implementation and debugging practice |
| `interview-prep/` | Interview questions, mock interviews, coding prompts, and rubrics |
| `src/` | Real API implementation |
| `prisma/` | Schema, migrations, and seed data |

## Maintenance Rule

When a feature changes, check whether the change should update:

- README or roadmap.
- Relevant chapter.
- Relevant cheatsheet.
- Example or lab.
- Interview question or rubric.
- Swagger docs.
- Tests.

Not every change needs every asset, but user-facing behavior and learning concepts should
not drift.
