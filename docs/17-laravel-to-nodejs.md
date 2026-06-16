# 17 · Laravel → Node.js

A bridge chapter for PHP/Laravel developers. You already know backend concepts — here is
how they translate to the Node.js + Express + Prisma stack in this repo.

## What it is

A side-by-side mapping of Laravel features to their Node.js equivalents, plus the mindset
shifts that trip people up.

## Why it matters

You learn faster by mapping new tools onto concepts you already understand. The hard part
of switching is not the concepts — it is the runtime model (event loop) and the lack of
framework "magic."

## Big-picture mapping

| Laravel | Node.js (this project) |
| --- | --- |
| Routing (`routes/api.php`) | Express `Router` in `*.routes.ts` |
| Controllers | `*.controller.ts` |
| Eloquent models | Prisma models + `*.repository.ts` |
| Migrations (`php artisan migrate`) | Prisma migrations (`prisma migrate`) |
| Form Requests | Zod schemas (`*.schemas.ts`) |
| Middleware (classes) | Express middleware (functions) |
| Service container / DI | plain imports / factory functions |
| Gates & Policies | role middleware + ownership checks |
| Sanctum / Passport | JWT + bcrypt |
| Artisan commands | npm scripts + `tsx` scripts |
| Tinker | `prisma studio` / a REPL |
| PHPUnit / Pest | Jest + Supertest |
| `config()` + `.env` | validated `config/env.ts` + `.env` |
| Queues (`queue:work`) | BullMQ workers + Redis |
| Blade (views) | usually none — APIs return JSON |
| Sail | Docker Compose |

## Mindset shifts

1. **One long-lived process, not per-request.** PHP-FPM resets globals each request; Node
   keeps the process alive, so module-level state persists. Never store per-user data in a
   module variable.
2. **Async everywhere.** DB and I/O calls return promises; you `await` them. There is no
   transparent blocking like in PHP.
3. **Less magic, more wiring.** No auto-resolving service container or facades. You import
   what you use. This is more verbose but easier to trace.
4. **Types up front.** TypeScript + Zod replace runtime-only validation; you think about
   shapes earlier.
5. **Explicit relations.** Prisma makes you `include` relations; no lazy-loading surprises
   (and no accidental N+1 from `$model->relation`).

## Simple code example

```php
// Laravel controller
public function store(StoreTaskRequest $request) {
    $task = Task::create($request->validated());
    return response()->json($task, 201);
}
```

```ts
// Express + Prisma equivalent (this project)
export async function createTask(req: Request, res: Response) {
  const task = await tasksService.create(req.user.id, req.body); // body already Zod-validated
  res.status(201).json(task);
}
```

## Practical example from this project

Open any module folder (e.g. `src/modules/projects/`). It is intentionally laid out like a
Laravel feature: routes → controller → service → repository, with a Form-Request-style Zod
schema. The README's Laravel comparison table links the same way.

## Common beginner mistakes (for Laravel devs)

- Expecting facades/global helpers — import explicitly instead.
- Forgetting `await` because PHP never needed it.
- Storing request/user state in module-level variables (it leaks across requests).
- Looking for Eloquent's lazy relations — load them explicitly with `include`.
- Expecting CSRF tokens for a token-based API (not needed; use CORS/SameSite).

## Best practices

- Map each Laravel concept to its Node equivalent before coding (use the table above).
- Lean on TypeScript + Zod the way you leaned on Form Requests.
- Keep controllers thin and logic in services, as you would with Laravel actions/services.
- Use repositories as your "Eloquent boundary."

## Study checklist

- [ ] I can map every core Laravel concept to its Node equivalent.
- [ ] I understand the long-lived-process vs per-request difference.
- [ ] I know why `await` is everywhere.
- [ ] I can build a feature module the way I'd build a Laravel resource.

## Interview questions

**Q: Biggest difference between Laravel and a Node/Express backend?**
A: The runtime model: Node is a single long-lived, event-loop-driven process handling many
concurrent requests asynchronously, whereas PHP-FPM handles each request in its own
short-lived process.

**Q: What replaces Eloquent in this stack?**
A: Prisma as the ORM, wrapped in repository files; relations are loaded explicitly.

**Q: What replaces Form Requests?**
A: Zod schemas validated by middleware, which also give you inferred TypeScript types.
