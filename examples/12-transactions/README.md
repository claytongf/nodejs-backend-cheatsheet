# 12 · Database Transactions

Make several writes succeed or fail **together** (atomicity). If any step throws, every
write inside the transaction is rolled back.

```bash
docker compose up -d
npm run prisma:migrate
npx tsx examples/12-transactions/index.ts
```

Shows the **interactive** form `prisma.$transaction(async (tx) => { ... })` for multi-write
business operations (create a project + its initial tasks atomically), and proves that a
failure halfway through rolls **everything** back.

Compare with the **array** form `prisma.$transaction([findMany, count])` already used for
consistent reads in
[`src/modules/projects/projects.repository.ts`](../../src/modules/projects/projects.repository.ts).

Related: [docs/09-database-prisma-postgresql.md](../../docs/09-database-prisma-postgresql.md)
