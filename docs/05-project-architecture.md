# 05 · Project Architecture

## What it is

A consistent way to organize a backend so that responsibilities are separated and the
codebase scales. This project uses a **modular, layered** architecture:

```
routes → controller → service → repository → Prisma (database)
```

Each layer has one job and only talks to its immediate neighbors.

## The layers

| Layer | File | Responsibility |
| --- | --- | --- |
| Routes | `*.routes.ts` | Map HTTP paths to controllers, attach middleware |
| Controller | `*.controller.ts` | Read `req`, call a service, send `res` |
| Service | `*.service.ts` | Business logic, authorization decisions |
| Repository | `*.repository.ts` | The only place that touches Prisma |
| Schemas | `*.schemas.ts` | Zod validation + inferred types |
| Types | `*.types.ts` | Shared TypeScript types |

## Why it matters in backend development

- **Testability** — services can be tested without HTTP; repositories isolate the DB.
- **Replaceability** — swap the database by changing only repositories.
- **Readability** — every file has a predictable purpose.
- **Onboarding** — new devs know exactly where code goes.

## How it appears in real Node.js jobs

Teams enforce a layering like this in code review. "Why is there a Prisma query in the
controller?" is a real review comment. Knowing where logic belongs is a marker of a mid-
level developer.

## Simple code example

```ts
// tasks.controller.ts (thin)
export async function createTask(req, res) {
  const task = await tasksService.create(req.user.id, req.body);
  res.status(201).json(task);
}

// tasks.service.ts (logic)
export const tasksService = {
  async create(ownerId: string, data: CreateTaskInput) {
    // business rules, ownership, etc.
    return tasksRepository.create({ ...data, ownerId });
  },
};

// tasks.repository.ts (DB only)
export const tasksRepository = {
  create(data) {
    return prisma.task.create({ data });
  },
};
```

## Practical example from this project

The whole `src/modules/` tree follows this. Open `src/modules/projects/` and read the
files top to bottom: `projects.routes.ts` wires middleware and controllers,
`projects.controller.ts` stays thin, `projects.service.ts` enforces ownership,
`projects.repository.ts` is the only file importing the Prisma client.

## Laravel comparison

| Laravel | This project |
| --- | --- |
| Controller | `*.controller.ts` |
| Service class | `*.service.ts` |
| Eloquent model / Repository | `*.repository.ts` |
| Form Request | `*.schemas.ts` (Zod) |
| `routes/api.php` | `*.routes.ts` |

Laravel often puts logic in fat controllers or models; here we deliberately keep
controllers thin and isolate DB access in repositories.

## Common beginner mistakes

- Putting business logic in controllers ("fat controllers").
- Calling Prisma directly from a controller or service helper.
- Mixing validation into controllers instead of using schemas + middleware.
- Creating layers you do not need (overengineering) — only add a file when it earns its place.

## Best practices

- Keep controllers thin; keep services pure-ish and testable.
- Repositories return plain data; services apply rules.
- Co-locate everything for a feature in its module folder.
- Do not abstract until you have repeated yourself at least twice.

## Study checklist

- [ ] I can explain each layer's responsibility.
- [ ] I know why DB access is isolated in repositories.
- [ ] I can add a new module following the structure.
- [ ] I can justify when *not* to add a layer.

## Interview questions

**Q: Why separate controller, service, and repository?**
A: Separation of concerns: HTTP handling, business logic, and data access change for
different reasons and are easier to test in isolation.

**Q: Isn't this overengineering for a small app?**
A: It can be — for a tiny script, skip layers. For a growing API with auth, ownership, and
tests, the structure pays off quickly and keeps reviews simple.
