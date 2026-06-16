import type { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { requireUser } from '../../shared/utils/auth-context.js';

export async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body);
  res.status(200).json(result);
}

export async function me(req: Request, res: Response): Promise<void> {
  const authUser = requireUser(req);
  const user = await authService.me(authUser.id);
  res.json(user);
}
