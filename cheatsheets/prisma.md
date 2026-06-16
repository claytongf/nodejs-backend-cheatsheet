# Cheatsheet · Prisma

## CLI

| Command | Does |
| --- | --- |
| `npx prisma init` | Create schema + `.env` |
| `npx prisma generate` | Generate the typed client |
| `npx prisma migrate dev` | Create + apply migration (dev) |
| `npx prisma migrate deploy` | Apply migrations (prod/CI) |
| `npx prisma migrate reset` | Drop + recreate + seed |
| `npx prisma studio` | Visual DB browser |
| `npx prisma db push` | Sync schema without migration (proto) |

## Schema basics

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     @default(USER)
  projects  Project[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { USER ADMIN }
```

## Field attributes

| Attribute | Meaning |
| --- | --- |
| `@id` | Primary key |
| `@unique` | Unique constraint |
| `@default(...)` | Default value |
| `@relation(...)` | Relation config |
| `?` (e.g. `String?`) | Nullable |
| `@updatedAt` | Auto-update timestamp |

## Queries

```ts
prisma.user.create({ data });
prisma.user.findUnique({ where: { id } });
prisma.user.findFirst({ where: { email } });
prisma.user.findMany({ where: { role: 'USER' }, take: 20, skip: 0 });
prisma.user.update({ where: { id }, data });
prisma.user.delete({ where: { id } });
prisma.user.count({ where });
```

## Relations & selection

```ts
prisma.project.findMany({
  where: { ownerId },
  include: { tasks: true },              // load relation (avoid N+1)
  // or select only fields you need:
  // select: { id: true, name: true },
});
```

## Transactions

```ts
await prisma.$transaction([
  prisma.task.deleteMany({ where: { projectId } }),
  prisma.project.delete({ where: { id: projectId } }),
]);
```

## Tip

Never return `passwordHash` — use `select` to omit it.
