# 04 · Express Fundamentals

## What it is

**Express** is a minimal, unopinionated web framework for Node. It gives you a router,
a middleware pipeline, and helpers on `req`/`res`. A request flows through a chain of
**middleware** functions until one sends a response.

## Why it matters in backend development

Express is the most widely used Node web framework. Understanding its middleware model —
`(req, res, next)` — is the key to routing, validation, auth, logging, and error handling.

## Core building blocks

| Piece | Role |
| --- | --- |
| `app` | The application instance |
| `Router` | Groups related routes |
| Middleware | `(req, res, next) => {}` — runs in order |
| Route handler | Final middleware that responds |
| Error middleware | `(err, req, res, next) => {}` — 4 args |

## How it appears in real Node.js jobs

You will split routes into routers per feature, add middleware for JSON parsing, auth,
and logging, and centralize error handling. Knowing middleware **order** (it matters!) is
essential.

## Simple code example

```ts
import express from 'express';

const app = express();
app.use(express.json()); // parse JSON bodies

// Middleware runs in order:
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass control to the next handler
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000);
```

## Practical example from this project

[src/app.ts](../src/app.ts) builds the app: it adds `express.json()`, request logging
(pino-http), mounts each module's router (`/auth`, `/users`, `/projects`, `/tasks`), then
adds the **not-found** and **error** middleware *last* (order matters). `server.ts`
calls `listen`. This split lets tests import `app` without opening a port.

## Laravel comparison

| Laravel | Express |
| --- | --- |
| `routes/api.php` | `Router` in `*.routes.ts` |
| `app/Http/Middleware/*` | functions in `src/middlewares/` |
| Global middleware in `Kernel.php` | `app.use(...)` order in `app.ts` |
| Controller methods | route handler functions |

Express middleware is just a function; Laravel middleware is a class with `handle()`. Same
idea, different shape.

## Common beginner mistakes

- Forgetting `app.use(express.json())`, then `req.body` is `undefined`.
- Forgetting to call `next()` (the request hangs forever).
- Registering error middleware **before** routes (it must come last).
- Sending two responses (`res.json` twice) → "headers already sent" error.

## Best practices

- One `Router` per feature; mount it under a base path.
- Keep handlers thin — push logic into services (chapter 05).
- Put error/not-found middleware **last**.
- Use an `asyncHandler` wrapper so thrown errors reach the error middleware.

## Study checklist

- [ ] I can explain the `(req, res, next)` signature.
- [ ] I know why middleware order matters.
- [ ] I can create and mount a `Router`.
- [ ] I know how error middleware (4 args) differs from normal middleware.

## Interview questions

**Q: What is middleware in Express?**
A: A function with access to `req`, `res`, and `next` that runs during the request
lifecycle. It can modify req/res, end the response, or call `next()` to continue.

**Q: How does Express know a function is error-handling middleware?**
A: By its arity — it has four parameters `(err, req, res, next)`.

**Q: Why split `app.ts` and `server.ts`?**
A: So tests can import the configured app (for Supertest) without starting a real
listening server.
