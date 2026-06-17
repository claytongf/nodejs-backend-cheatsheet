// Generic Zod validation middleware. Validates and replaces req.body with the
// parsed (typed, clean) result. On failure it throws a ZodError, which the error
// middleware turns into a 422 with field-level messages.
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}

// Same idea for query strings (?page=2&limit=20). Query values arrive as strings,
// so the schema typically uses `z.coerce` to turn them into numbers/booleans. The
// parsed result replaces req.query; controllers read it with a single typed cast.
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.query = schema.parse(req.query);
    next();
  };
}
