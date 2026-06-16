// 07 · Centralized error handling with typed errors + an async wrapper.
// Run: npx tsx examples/07-error-handling/index.ts
// Try:  curl http://localhost:4003/tasks/123  -> 404 (consistent shape)

import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from 'express';

class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

// Forwards rejected promises to the error middleware (no try/catch needed).
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const app = express();

app.get(
  '/tasks/:id',
  asyncHandler(async (_req, _res) => {
    // Pretend we looked it up and found nothing:
    throw new NotFoundError('Task not found');
  }),
);

// Error middleware — registered LAST, has 4 args.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(4003, () => console.log('Error handling demo on http://localhost:4003'));
