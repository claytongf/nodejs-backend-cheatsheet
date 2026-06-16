# Cheatsheet · TypeScript (Backend)

## Basic types

```ts
let id: string;
let count: number;
let active: boolean;
let tags: string[];
let pair: [string, number]; // tuple
let anything: unknown; // prefer over `any`
```

## Objects, interfaces, unions

```ts
type Role = 'admin' | 'user'; // union literal
interface User {
  id: string;
  role: Role;
}
type Maybe<T> = T | null; // generic alias
```

## Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}
const greet = (name: string): string => `Hi ${name}`;
function first<T>(xs: T[]): T | undefined {
  return xs[0];
} // generic
```

## Narrowing

```ts
if (typeof x === 'string') {
  /* x is string */
}
if (x instanceof AppError) {
  /* x is AppError */
}
if ('id' in obj) {
  /* has id */
}
const role = user.role ?? 'user'; // nullish coalescing
user?.profile?.bio; // optional chaining
```

## Utility types

| Type                    | Meaning              |
| ----------------------- | -------------------- |
| `Partial<T>`            | All props optional   |
| `Required<T>`           | All props required   |
| `Pick<T, K>`            | Subset of keys       |
| `Omit<T, K>`            | Exclude keys         |
| `Record<K, V>`          | Map type             |
| `ReturnType<typeof fn>` | Function return type |

## With Zod

```ts
import { z } from 'zod';
const schema = z.object({ email: z.string().email() });
type Input = z.infer<typeof schema>; // type from schema
```

## tsconfig essentials

| Option               | Why                      |
| -------------------- | ------------------------ |
| `"strict": true`     | Enable all strict checks |
| `"strictNullChecks"` | Handle null/undefined    |
| `"noUnusedLocals"`   | Catch dead variables     |
| `"esModuleInterop"`  | Clean default imports    |
