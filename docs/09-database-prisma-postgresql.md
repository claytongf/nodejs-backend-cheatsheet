# 09 · Database: Prisma & PostgreSQL

## What it is

**PostgreSQL** is a powerful open-source relational database. **Prisma** is a type-safe ORM
for Node/TypeScript: you describe your models in `schema.prisma`, run migrations, and get a
fully typed client (`prisma.task.findMany()`).

## Why it matters in backend development

Almost every backend persists data. Prisma gives you type-safe queries, migrations as code,
and a great developer experience, while PostgreSQL gives you reliability, relations, and
constraints. Getting modeling and relations right prevents whole categories of bugs.

## How it appears in real Node.js jobs

You will define models and relations, write migrations, run them in CI/production
(`migrate deploy`), and query through Prisma in repositories. You will also reason about
indexes, unique constraints, and N+1 queries.

## The schema (this project)

```prisma
model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  passwordHash String
  role         Role      @default(USER)
  projects     Project[]
  tasks        Task[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role { USER ADMIN }
```

See [prisma/schema.prisma](../prisma/schema.prisma) for the full file including `Task`.

## Simple code example

```ts
// Typed queries via the generated client
const user = await prisma.user.create({
  data: { name: 'Ada', email: 'ada@x.com', passwordHash: hash },
});

const projects = await prisma.project.findMany({
  where: { ownerId: user.id },
  include: { tasks: true }, // avoid N+1 by including relations
});
```

## Practical example from this project

`src/database/prisma.ts` exports a single shared `PrismaClient`. Repositories
(`*.repository.ts`) are the only files that import it. For example,
`src/modules/tasks/tasks.repository.ts` wraps `prisma.task` CRUD, keeping SQL concerns out
of services and controllers.

## Laravel comparison

| Laravel / Eloquent           | Prisma                                      |
| ---------------------------- | ------------------------------------------- |
| `php artisan make:migration` | edit `schema.prisma`                        |
| `php artisan migrate`        | `prisma migrate dev`                        |
| `User::find($id)`            | `prisma.user.findUnique({ where: { id } })` |
| `$user->projects` (lazy)     | `include: { projects: true }` (explicit)    |
| `php artisan tinker`         | `prisma studio`                             |

Big difference: Eloquent uses lazy-loading (easy N+1); Prisma makes relation loading
**explicit** via `include`/`select`, which is safer by default.

## Common beginner mistakes

- N+1 queries: looping and querying per item instead of using `include`.
- Forgetting to run `prisma generate` after schema changes (stale client types).
- Editing the database by hand instead of through migrations.
- Storing secrets/passwords without hashing (see chapter 10).
- Not adding `@unique` where uniqueness is required (e.g. email).

## Best practices

- One shared `PrismaClient` instance (avoid connection exhaustion).
- Access the DB only through repositories.
- Use migrations for every schema change; never edit prod data manually.
- Use `select` to fetch only the fields you need; never return `passwordHash`.
- Add indexes/unique constraints to enforce invariants in the DB.

## Study checklist

- [ ] I can define models and relations in `schema.prisma`.
- [ ] I can create and apply a migration.
- [ ] I can avoid N+1 with `include`/`select`.
- [ ] I know why we share one PrismaClient.

## Interview questions

**Q: What is an ORM and what does Prisma add?**
A: An ORM maps database rows to objects. Prisma adds full TypeScript type-safety, a
declarative schema, and migrations generated from that schema.

**Q: What is the N+1 problem?**
A: Running one query to fetch a list, then one extra query per item for its relations.
Fix it by loading relations in a single query (`include`/`select`).

**Q: Why one shared PrismaClient?**
A: Each client holds a connection pool; creating many clients exhausts database
connections.
