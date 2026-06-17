# 19 · Performance & Data Access

## Learning Objective

By the end of this chapter, you should be able to spot and fix the most common backend
performance problems — N+1 queries, missing indexes, unbounded result sets — and explain
how transactions and connection pooling affect correctness and throughput.

## What It Is

"Performance" at the backend usually means **how you talk to the database**. The slowest
part of most requests is not your JavaScript — it is waiting on queries. Data-access skills
are: fetching the right rows in the fewest queries, using indexes, paginating, and grouping
related writes in a transaction.

## Why It Matters in Backend Development

An endpoint that works with 10 rows can fall over with 10 million. Senior engineers are
expected to write code that stays fast as data grows, and to diagnose a slow endpoint from
logs and query plans instead of guessing.

## How It Appears in Real Node.js Jobs

- A list endpoint times out in production; you find it loads every row with no `limit`.
- An endpoint runs one query per item in a loop (the **N+1 problem**); you fix it with a
  single `include`/`where in (...)` query.
- A report query is slow; you add an index and read `EXPLAIN ANALYZE` to confirm.
- Two writes must both succeed or both fail; you wrap them in a transaction.

## Simple Code Example

```ts
// ❌ N+1: one query for projects, then one query PER project for its tasks.
const projects = await prisma.project.findMany();
for (const p of projects) {
  p.tasks = await prisma.task.findMany({ where: { projectId: p.id } });
}

// ✅ One query: let the database join and return everything.
const projects = await prisma.project.findMany({ include: { tasks: true } });
```

## Practical Example from This Project

`GET /tasks` is paginated, filtered, and sorted — the production-ready shape of a list
endpoint. Inspect the flow:

- [tasks.schemas.ts](../src/modules/tasks/tasks.schemas.ts) — `listTasksQuerySchema` caps
  `limit` at 100 so a client can never request an unbounded page.
- [tasks.repository.ts](../src/modules/tasks/tasks.repository.ts) — `list()` runs the
  `findMany` and the `count` inside a single `prisma.$transaction([...])`, so the total
  matches the page (no torn read between two separate round trips).
- [prisma/schema.prisma](../prisma/schema.prisma) — `Task` and `Project` carry `@@index`
  on `ownerId`/`projectId`, the columns the queries filter by.

Indexing the foreign keys you filter on is the single cheapest performance win in this
codebase.

## Guided Exercise

1. Add an index to a column you sort by, e.g. `@@index([createdAt])` on `Task`, and migrate.
2. Run `npm run prisma:studio` and create ~50 tasks (or extend `prisma/seed.ts`).
3. Call `GET /tasks?limit=10&page=2&sort=createdAt&order=desc` and confirm you get page 2.

## Practical Challenge

Add a `GET /projects/:id/tasks` endpoint that returns a project **with its task count**
without loading every task. Acceptance criteria: one database round trip, the count comes
from the database (not `tasks.length` in Node), and a test proves the count is correct.

## Common Beginner Mistakes

- Returning every row (no `take`/`limit`) — fine in dev, fatal in production.
- Looping queries instead of one `include`/batched query (N+1).
- Sorting or filtering on unindexed columns at scale.
- Counting in JavaScript (`rows.length`) instead of `prisma.count()`.
- Doing related writes as separate calls so a crash leaves half-written data.

## Best Practices

- Always paginate list endpoints and cap the page size.
- Index the columns you filter, sort, and join on.
- Group multi-step writes in `prisma.$transaction`.
- Measure before optimizing: read the query plan, do not guess.
- Select only the columns you need (`select`) on hot paths.

## Study Checklist

- [ ] I can explain and fix an N+1 query.
- [ ] I know why list endpoints must be paginated and capped.
- [ ] I can say when to add a database index and how to verify it helped.
- [ ] I can explain why `count` + `findMany` belong in one transaction here.

## Interview Questions

**Q: What is the N+1 query problem?**
A: Running one query to fetch a list, then one extra query per item to fetch related data.
Fixing it means fetching the related data in a single query (a join / `include` / `where in`).

**Q: How do you make a list endpoint safe at scale?**
A: Paginate with `skip`/`take`, cap the maximum page size, index the filtered/sorted
columns, and return a total via a database `count` rather than loading everything.

**Q: When do you use a database transaction?**
A: When multiple writes must all succeed or all fail together, or when a read and a count
must be consistent with each other.

## Strong Answer Signals

A strong answer names a concrete symptom (timeout, high DB CPU), the diagnosis tool
(`EXPLAIN ANALYZE`, slow-query logs), and the fix — and admits that indexes speed reads but
cost writes, so you index deliberately.
</content>
