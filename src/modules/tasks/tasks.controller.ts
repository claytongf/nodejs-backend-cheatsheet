import type { Request, Response } from 'express';
import { tasksService } from './tasks.service.js';
import { requireUser } from '../../shared/utils/auth-context.js';
import type { ListTasksQuery } from './tasks.schemas.js';

export async function create(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const task = await tasksService.create(actor, req.body);
  res.status(201).json(task);
}

export async function list(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  // validateQuery has already parsed/coerced req.query against listTasksQuerySchema.
  const query = req.query as unknown as ListTasksQuery;
  const result = await tasksService.list(actor, query);
  res.json(result);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const task = await tasksService.getById(req.params.id, actor);
  res.json(task);
}

export async function update(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const task = await tasksService.update(req.params.id, req.body, actor);
  res.json(task);
}

export async function complete(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const task = await tasksService.complete(req.params.id, actor);
  res.json(task);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  await tasksService.remove(req.params.id, actor);
  res.status(204).end();
}
