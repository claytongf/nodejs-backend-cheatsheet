# 16 · NestJS Overview

## What it is

**NestJS** is an opinionated, batteries-included Node framework built on top of Express (or
Fastify). It adds modules, dependency injection, decorators, and a strong structure out of
the box — closer in spirit to Angular or Laravel than to bare Express.

## Why it matters in backend development

Many companies standardize on Nest because its structure scales across large teams. After
learning the fundamentals with Express (this repo), Nest is the common "next step," and it
appears frequently in job postings.

## How it appears in real Node.js jobs

You will see `@Controller`, `@Injectable` services, `@Module` definitions, guards (auth),
pipes (validation), and interceptors. The concepts map directly onto what you learned here.

## Concept mapping (this project → Nest)

| This project (Express)            | NestJS                              |
| --------------------------------- | ----------------------------------- |
| `*.routes.ts` + `*.controller.ts` | `@Controller` with route decorators |
| `*.service.ts`                    | `@Injectable()` service (DI)        |
| `validate.middleware.ts` + Zod    | Pipes (e.g. `ZodValidationPipe`)    |
| `auth.middleware.ts`              | Guards (`@UseGuards`)               |
| `error.middleware.ts`             | Exception filters                   |
| manual imports                    | dependency injection container      |

## Simple code example

```ts
// Nest controller — decorators replace explicit routers
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }
}
```

## Practical example from this project

The module layout here (`tasks.controller.ts`, `tasks.service.ts`,
`tasks.repository.ts`) deliberately mirrors how a Nest module is organized. Porting a module
to Nest mostly means adding decorators and registering it in a `@Module`.

## Laravel comparison

NestJS is the Node framework that feels most like Laravel: strong conventions, dependency
injection (service container), guards (≈ middleware/policies), and modules (≈ service
providers). If you liked Laravel's structure, you will likely enjoy Nest.

## Common beginner mistakes

- Jumping to Nest before understanding Express/HTTP fundamentals (the "magic" hides too
  much).
- Fighting the DI container instead of embracing it.
- Overusing decorators/abstractions for trivial endpoints.

## Best practices

- Learn Express fundamentals first (you did — this repo).
- Embrace Nest's structure rather than working around it.
- Keep using validation (pipes), guards (auth), and filters (errors) — same ideas, Nest
  flavor.

## Study checklist

- [ ] I can map controller/service/repository to Nest concepts.
- [ ] I understand what guards, pipes, and filters do.
- [ ] I know why DI matters in Nest.
- [ ] I can decide when Nest is worth it over plain Express.

## Interview questions

**Q: Express vs NestJS — when to choose which?**
A: Express for small/flexible services and learning; Nest for larger teams wanting
structure, DI, and conventions out of the box.

**Q: What problem does dependency injection solve?**
A: It decouples classes from constructing their dependencies, making code easier to test
(swap in mocks) and to wire together.

**Q: What is a Nest guard?**
A: A class that decides whether a request may proceed (e.g. auth/roles) — conceptually like
Express auth middleware.
