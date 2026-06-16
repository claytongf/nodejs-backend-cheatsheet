// HTTP layer for tasks. Thin: read req, call the service, send res.
// Errors thrown by the service are caught by Express and forwarded to the error middleware.
import type { Request, Response } from 'express';
import { tasksService } from './tasks.service.js';

export function list(_req: Request, res: Response): void {
  res.json(tasksService.list());
}

export function getById(req: Request, res: Response): void {
  res.json(tasksService.getById(req.params.id));
}

export function create(req: Request, res: Response): void {
  res.status(201).json(tasksService.create(req.body));
}

export function update(req: Request, res: Response): void {
  res.json(tasksService.update(req.params.id, req.body));
}

export function complete(req: Request, res: Response): void {
  res.json(tasksService.complete(req.params.id));
}

export function remove(req: Request, res: Response): void {
  tasksService.remove(req.params.id);
  res.status(204).end();
}
