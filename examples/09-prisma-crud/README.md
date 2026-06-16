# 09 · Prisma CRUD

Create/read/update/delete against PostgreSQL using the project's schema. **Needs the DB.**

```bash
docker compose up -d
npm run prisma:migrate
npx tsx examples/09-prisma-crud/index.ts
```

See [docs/09-database-prisma-postgresql.md](../../docs/09-database-prisma-postgresql.md).
