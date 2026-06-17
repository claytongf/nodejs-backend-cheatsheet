# Examples

Small, isolated, runnable examples — one concept each. Run any `.ts` file with:

```bash
npx tsx examples/<folder>/index.ts
```

| Folder              | Concept                         | Chapter                                             |
| ------------------- | ------------------------------- | --------------------------------------------------- |
| `01-node-core`      | Node globals & core modules     | [01](../docs/01-nodejs-runtime.md)                  |
| `02-modules`        | ES modules (import/export)      | [02](../docs/02-javascript-typescript.md)           |
| `03-async-await`    | Promises, await, event loop     | [06](../docs/06-async-await-promises-event-loop.md) |
| `04-http-server`    | Raw `http` server (no Express)  | [03](../docs/03-http-and-rest-apis.md)              |
| `05-express-routes` | Express routers & params        | [04](../docs/04-express-fundamentals.md)            |
| `06-middlewares`    | Custom middleware pipeline      | [04](../docs/04-express-fundamentals.md)            |
| `07-error-handling` | Typed errors + error middleware | [08](../docs/08-error-handling.md)                  |
| `08-zod-validation` | Validating input with Zod       | [07](../docs/07-validation-with-zod.md)             |
| `09-prisma-crud`    | Prisma CRUD (needs the DB)      | [09](../docs/09-database-prisma-postgresql.md)      |
| `10-tests`          | Jest + Supertest                | [12](../docs/12-testing-jest-supertest.md)          |

> Examples are deliberately excluded from the main `tsconfig` build so they stay simple and
> independent from the API in `src/`.

## Prerequisites

All npm dependencies required by the examples are already installed by `npm install`.
Most examples run immediately. Database-backed examples need PostgreSQL and migrations.

| Example             | Needs                                 | Introduced in        |
| ------------------- | ------------------------------------- | -------------------- |
| `08-zod-validation` | `zod`                                 | Phase 6 (validation) |
| `09-prisma-crud`    | `@prisma/client` + a running database | Phase 7 (Prisma)     |
| `10-tests`          | `jest` / `ts-jest`                    | Phase 10 (tests)     |

For `09-prisma-crud`, prepare the development database first:

```bash
docker compose up -d
npm run prisma:migrate
```

For `10-tests`, prepare the separate test database first:

```bash
npm run db:test:setup
```
