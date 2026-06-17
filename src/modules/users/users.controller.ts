// HTTP layer for users. Thin: read req, call the service, send res.
import type { Request, Response } from 'express';
import { usersService } from './users.service.js';
import { requireUser } from '../../shared/utils/auth-context.js';
import type { ListUsersQuery } from './users.schemas.js';

export async function list(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ListUsersQuery;
  const result = await usersService.list(query);
  res.json(result);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const user = await usersService.getById(req.params.id);
  res.json(user);
}

export async function update(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const user = await usersService.update(req.params.id, req.body, actor);
  res.json(user);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await usersService.remove(req.params.id);
  res.status(204).end();
}
