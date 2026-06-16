# 08 · Error Handling

## What it is

A **centralized** strategy for turning failures into consistent HTTP responses. Code
**throws** typed errors; a single **error middleware** catches them and formats the
response. Unexpected errors become a safe `500` without leaking internals.

## Why it matters in backend development

Inconsistent error handling is a top source of bugs and security leaks. A central handler
gives clients a predictable error shape, prevents stack traces from reaching users, and
keeps `try/catch` out of every controller.

## How it appears in real Node.js jobs

You will define an error hierarchy (`NotFoundError`, `UnauthorizedError`, ...), an
`asyncHandler` to forward rejected promises, and one error middleware registered last.
This is standard in production Express apps.

## Simple code example

```ts
// A typed application error
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

// Error middleware (must be registered LAST, has 4 args)
function errorMiddleware(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
}
```

## Practical example from this project

`src/shared/errors/` defines `AppError` and subclasses. Services throw them
(`throw new NotFoundError('Task not found')`). The `asyncHandler` in `src/shared/utils/`
forwards async errors, and [src/middlewares/error.middleware.ts](../src/middlewares/error.middleware.ts)
formats them — Zod errors become `422`, `AppError`s use their status, everything else is a
logged `500`. The 404 fallback is `not-found.middleware.ts`.

## Laravel comparison

| Laravel                       | This project                |
| ----------------------------- | --------------------------- |
| `App\Exceptions\Handler`      | `error.middleware.ts`       |
| `abort(404)`                  | `throw new NotFoundError()` |
| `ValidationException` → `422` | `ValidationError` → `422`   |
| `ModelNotFoundException`      | `NotFoundError`             |

Laravel's global Handler is conceptually the same as Express error middleware.

## Common beginner mistakes

- Registering error middleware before the routes (it never runs).
- Forgetting the 4th `next` parameter, so Express treats it as normal middleware.
- Sending raw error objects/stack traces to the client.
- `try/catch` in every controller instead of using `asyncHandler`.
- Returning `200` with an `error` field instead of a proper status code.

## Best practices

- One error hierarchy, one error middleware, registered **last**.
- Map known errors to status codes; default everything else to `500`.
- Log the full error server-side; send a safe message to the client.
- Never leak stack traces or DB errors in production responses.

## Study checklist

- [ ] I can create a typed error hierarchy.
- [ ] I know why error middleware has four parameters.
- [ ] I can forward async errors with a wrapper.
- [ ] I know what to log vs what to return to the client.

## Interview questions

**Q: How do you handle errors thrown inside an async route handler?**
A: Wrap the handler (e.g. `asyncHandler`) so rejected promises are passed to `next(err)`,
reaching the error middleware. (In Express 5 this is built in.)

**Q: Why centralize error handling?**
A: Consistent responses, no duplicated `try/catch`, one place to log and to control what
leaks to clients.

**Q: What status code for a validation failure?**
A: `422 Unprocessable Entity` (some teams use `400`); this project uses `422`.
