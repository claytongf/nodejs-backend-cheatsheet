# 25 · Scaling & Architecture Judgment

## Learning Objective

By the end of this chapter, you should be able to explain how a Node.js API scales
horizontally, why services must be stateless, and how to apply SOLID and dependency
inversion in this codebase **without** a framework — plus when to split a module.

## What It Is

Scaling is serving more traffic. **Vertical** scaling means a bigger machine; **horizontal**
scaling means more instances behind a load balancer. Architecture judgment is deciding how
to structure code so it can scale and change safely — and knowing when *not* to add
structure.

## Why It Matters in Backend Development

A single Node process uses one CPU core for your JavaScript. To use a 4-core box or to
survive an instance dying, you run multiple instances — which only works if each request can
be served by any instance. Senior engineers are paid for this judgment: scaling the system
and keeping the code changeable.

## How It Appears in Real Node.js Jobs

- The API runs as N stateless instances; the load balancer spreads traffic across them.
- Session state and caches live in shared stores (Postgres, Redis), never in process memory.
- `cluster`/PM2 or the container orchestrator runs one process per core.
- Code reviews push back on a "god service" and ask to split responsibilities (SOLID).

## Stateless Services

A service is **stateless** when it keeps no per-user data in process memory between
requests. This API is stateless: it authenticates with a **JWT** (the token carries the
identity — [10 · Authentication](10-authentication-jwt.md)), so any instance can serve any
request. If it stored sessions in a local variable, a second instance would not recognize
the user. That is why caches and sessions belong in Redis, not a module-level `Map`
(connecting back to [24 · Caching](24-caching.md)).

## SOLID & Dependency Inversion (no framework)

The layered structure already embodies SOLID without decorators or a DI container — exactly
the "no magic" rule in [CLAUDE.md](../CLAUDE.md):

- **Single Responsibility** — controllers do HTTP, services do logic, repositories do
  Prisma. Each file has one reason to change.
- **Dependency Inversion** — services depend on the repository's *shape*, not on Prisma
  directly. To unit-test a service in isolation, pass a fake repository with the same
  methods. See the layering in [05 · Project architecture](05-project-architecture.md) and
  the real flow in [tasks.service.ts](../src/modules/tasks/tasks.service.ts).

```ts
// Dependency inversion by plain function/closure — no framework needed.
export function makeTasksService(repo: TasksRepository) {
  return {
    list: (actor, query) => repo.list(/* ... */),
  };
}
// Production wires the real repo; tests wire a fake one.
```

## When to Split a Module

Follow the repo rule: **duplicate twice before extracting**. Split a service when it has
clearly separate responsibilities (e.g. task CRUD vs task notifications), not because it
"feels big". Premature abstraction is as costly as a god object.

## Guided Exercise

1. Read [tasks.service.ts](../src/modules/tasks/tasks.service.ts) and list the
   responsibilities of each layer it touches (controller, service, repository).
2. Identify one thing the service depends on that you could replace with a fake in a test.
3. Write down what would break if this API stored logged-in users in a local `Map`.

## Practical Challenge

Refactor one service to receive its repository as an argument (a factory function) instead
of importing it directly, then write a unit test that passes a fake repository — no database
required. Acceptance criteria: the existing integration tests still pass, and the new unit
test runs without a DB connection.

## Common Beginner Mistakes

- Storing sessions/state in process memory, breaking horizontal scaling.
- Assuming one Node process uses all CPU cores (it does not, for your JS).
- Putting business logic in controllers (can't reuse or unit-test it).
- Reaching for a DI framework when plain imports/closures suffice.
- Over-abstracting early ("just in case") instead of duplicating until a pattern is clear.

## Best Practices

- Keep services stateless; put shared state in Postgres/Redis.
- Run one process per core (cluster/PM2/orchestrator) behind a load balancer.
- Keep the controller→service→repository layering; depend on shapes, not concretions.
- Split by responsibility, and only after duplication proves the seam.
- Make scaling decisions from metrics ([23 · Observability](23-observability.md)), not vibes.

## Study Checklist

- [ ] I can explain horizontal vs vertical scaling.
- [ ] I can explain why this API is stateless and why that enables scaling.
- [ ] I can point to SOLID in the layered structure.
- [ ] I can apply dependency inversion here without a framework.

## Interview Questions

**Q: How do you scale a Node.js API horizontally?**
A: Run multiple stateless instances behind a load balancer, keep shared state in
Postgres/Redis, and use the JWT (or a shared session store) so any instance can serve any
request.

**Q: Why must the service be stateless to scale?**
A: With several instances, consecutive requests from one user can hit different instances;
if state lived in one process's memory, the others would not have it.

**Q: How do you apply dependency inversion without a DI framework?**
A: Have higher layers depend on an interface/shape (the repository's methods) and inject the
concrete implementation via plain function arguments or imports — real one in production, a
fake in tests.

## Strong Answer Signals

A strong answer connects statelessness to the JWT design, knows one Node process is
single-threaded for JS (so you scale with processes), and treats SOLID as a tool for
testability and change — not dogma.
</content>
