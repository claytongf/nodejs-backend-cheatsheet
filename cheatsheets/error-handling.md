# Cheatsheet · Error Handling

## Error hierarchy

```ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class BadRequestError extends AppError {
  constructor(m = 'Bad Request') {
    super(400, m);
  }
}
export class UnauthorizedError extends AppError {
  constructor(m = 'Unauthorized') {
    super(401, m);
  }
}
export class ForbiddenError extends AppError {
  constructor(m = 'Forbidden') {
    super(403, m);
  }
}
export class NotFoundError extends AppError {
  constructor(m = 'Not Found') {
    super(404, m);
  }
}
export class ConflictError extends AppError {
  constructor(m = 'Conflict') {
    super(409, m);
  }
}
```

## Throwing

```ts
const task = await repo.findById(id);
if (!task) throw new NotFoundError('Task not found');
```

## Async handler

```ts
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

## Error middleware (last, 4 args)

```ts
export function errorMiddleware(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res
      .status(422)
      .json({ message: 'Validation failed', errors: err.flatten().fieldErrors });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  logger.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
}
```

## Status map

| Error                  | Code  |
| ---------------------- | ----- |
| Validation             | `422` |
| Bad input              | `400` |
| No/invalid auth        | `401` |
| Not allowed            | `403` |
| Missing resource       | `404` |
| Duplicate (e.g. email) | `409` |
| Unexpected             | `500` |

## Rules

- ✅ Throw typed errors from services
- ✅ Format responses only in the error middleware
- ✅ Log full error, return safe message
- ❌ No `try/catch` in every controller (use `asyncHandler`)
- ❌ Never leak stack traces to clients
