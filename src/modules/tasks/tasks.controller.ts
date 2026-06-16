// HTTP layer for tasks. Thin: read req, call the service, send res.
// The async errors are forwarded to the error middleware by the asyncHandler wrapper.
import type { Request, Response } from 'express';
import { tasksService } from './tasks.service.js';

export async function list(_req: Request, res: Response): Promise<void> {
  res.json(await tasksService.list());
}

export async function getById(req: Request, res: Response): Promise<void> {
  res.json(await tasksService.getById(req.params.id));
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json(await tasksService.create(req.body));
}

export async function update(req: Request, res: Response): Promise<void> {
  res.json(await tasksService.update(req.params.id, req.body));
}

export async function complete(req: Request, res: Response): Promise<void> {
  res.json(await tasksService.complete(req.params.id));
}

export async function remove(req: Request, res: Response): Promise<void> {
  await tasksService.remove(req.params.id);
  res.status(204).end();
}
