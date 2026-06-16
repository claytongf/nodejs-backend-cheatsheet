# 07 · Validation with Zod

## What it is

**Zod** is a TypeScript-first schema validation library. You declare the shape and rules
of incoming data; Zod checks a value at **runtime** and gives you a typed, parsed result.
Because schemas are also types, you get validation and TypeScript types from one source.

## Why it matters in backend development

External input cannot be trusted: request bodies, query params, headers, and env vars may
be missing, malformed, or malicious. Validation at the boundary keeps bad data out of your
business logic and database, and turns "undefined is not a function" into a clean `400`.

## How it appears in real Node.js jobs

You will write a schema per endpoint, validate `req.body`/`req.params`/`req.query` in
middleware, and rely on `z.infer` so your handler receives a fully typed object. Validating
environment variables at startup is also standard.

## Simple code example

```ts
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

const result = createUserSchema.safeParse({ name: 'A', email: 'x', password: '123' });
if (!result.success) {
  console.log(result.error.flatten().fieldErrors);
}
```

## Practical example from this project

Each module has a `*.schemas.ts` (e.g. `src/modules/tasks/tasks.schemas.ts`) and the
generic [src/middlewares/validate.middleware.ts](../src/middlewares/validate.middleware.ts)
runs a schema against the request. On failure it throws a `ValidationError` that the error
middleware turns into a `422` with field-level messages. The env loader
`src/config/env.ts` validates `process.env` the same way.

## Laravel comparison

| Laravel                   | This project                   |
| ------------------------- | ------------------------------ |
| Form Request `rules()`    | Zod schema                     |
| `$request->validated()`   | the parsed Zod output (typed!) |
| `422` validation response | `ValidationError` → `422`      |

Laravel's validator returns loosely-typed arrays; Zod returns a value whose **TypeScript
type is inferred from the schema**, so the rest of your code is type-safe.

## Common beginner mistakes

- Validating in the controller by hand instead of with a reusable middleware.
- Trusting `req.body` types — TypeScript types are not runtime checks.
- Using `parse` (throws) where you wanted `safeParse` (returns a result), or vice versa.
- Duplicating the schema as a separate `interface` instead of using `z.infer`.

## Best practices

- One schema per operation (`createTaskSchema`, `updateTaskSchema`).
- Validate body, params, and query as needed; reject unknown fields when it matters.
- Infer types from schemas (`z.infer`) — single source of truth.
- Return field-level errors so clients can show useful messages.

## Study checklist

- [ ] I can write an object schema with constraints.
- [ ] I know the difference between `parse` and `safeParse`.
- [ ] I can infer a TypeScript type from a schema.
- [ ] I can validate request input in middleware.

## Interview questions

**Q: Why validate input if TypeScript already has types?**
A: TypeScript types are erased at runtime; they cannot stop a malformed request. Zod checks
the actual value at runtime.

**Q: `parse` vs `safeParse`?**
A: `parse` throws a `ZodError` on failure; `safeParse` returns `{ success, data | error }`
without throwing.

**Q: How do you keep validation and types in sync?**
A: Derive the type from the schema with `z.infer<typeof schema>` so there is one source of
truth.
