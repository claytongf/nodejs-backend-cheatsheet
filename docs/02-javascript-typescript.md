# 02 · JavaScript & TypeScript

## What it is

**JavaScript** is the language Node runs. **TypeScript** is JavaScript plus a static type
system that is checked at compile time and then **erased** — the output is plain JS. Types
catch mistakes before the code runs and power editor autocomplete.

## Why it matters in backend development

Backends move data between HTTP, your code, and a database. Types describe the **shape**
of that data so you catch a missing field or wrong type at compile time instead of at 3am
in production. On a team, types are documentation that cannot go stale.

## How it appears in real Node.js jobs

Most modern Node backends are written in TypeScript with `strict` mode on. You will define
interfaces/types for requests, responses, and database rows; use generics for reusable
helpers; and read `tsconfig.json` to understand the project's compiler settings.

## Simple code example

```ts
// Types describe shape; the compiler enforces it.
type Role = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  role: Role;
}

function greet(user: User): string {
  return `Hello, ${user.email} (${user.role})`;
}

// A generic, reusable helper:
function first<T>(items: T[]): T | undefined {
  return items[0];
}

greet({ id: '1', email: 'a@b.com', role: 'user' }); // ✅
// greet({ id: '1', email: 'a@b.com', role: 'guest' }); // ❌ compile error
```

## Practical example from this project

The whole API is strict TypeScript. For example,
[src/modules/tasks/tasks.types.ts](../src/modules/tasks/tasks.types.ts) defines the shapes
the task module passes between its layers, and Zod schemas in `tasks.schemas.ts` **infer**
TypeScript types so validation and types never drift apart.

## Laravel comparison

PHP added type hints and is dynamically typed by default; many Laravel apps rely on
PHPDoc and IDE helpers. TypeScript's types are far stricter and checked by a dedicated
compiler. Where Laravel uses arrays/`$request->validated()` (loosely typed), TypeScript +
Zod gives you a **typed** validated object.

## Common beginner mistakes

- Using `any` everywhere — it disables type checking.
- Confusing **types** (compile-time) with runtime validation (you still need Zod).
- Forgetting that types are erased: you cannot `typeof` an interface at runtime.
- Not enabling `strict` mode, then being surprised by `null`/`undefined` bugs.

## Best practices

- Turn on `strict` (this project does).
- Prefer `type`/`interface` over `any`; use `unknown` when a value is truly unknown.
- Let Zod **infer** types (`z.infer<typeof schema>`) so validation drives your types.
- Use union literal types (`'admin' | 'user'`) instead of loose strings.

## Study checklist

- [ ] I can define interfaces, unions, and generics.
- [ ] I understand that types are erased at runtime.
- [ ] I know when to use `unknown` vs `any`.
- [ ] I can read a `tsconfig.json`.

## Interview questions

**Q: What is the difference between `interface` and `type`?**
A: Both describe shapes. `interface` can be re-opened/merged and is idiomatic for object
shapes; `type` is more flexible (unions, intersections, primitives). For most objects they
are interchangeable.

**Q: Does TypeScript make code safer at runtime?**
A: No — types are erased after compilation. You still need runtime validation (Zod) for
external input.

**Q: What does `strict` mode enable?**
A: A bundle of stricter checks, most importantly `strictNullChecks`, which forces you to
handle `null`/`undefined` explicitly.
