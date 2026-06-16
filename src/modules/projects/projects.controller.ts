import type { Request, Response } from 'express';
import { projectsService } from './projects.service.js';
import { requireUser } from '../../shared/utils/auth-context.js';

export async function create(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const project = await projectsService.create(actor, req.body);
  res.status(201).json(project);
}

export async function list(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const projects = await projectsService.list(actor);
  res.json(projects);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const project = await projectsService.getById(req.params.id, actor);
  res.json(project);
}

export async function update(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  const project = await projectsService.update(req.params.id, req.body, actor);
  res.json(project);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const actor = requireUser(req);
  await projectsService.remove(req.params.id, actor);
  res.status(204).end();
}
