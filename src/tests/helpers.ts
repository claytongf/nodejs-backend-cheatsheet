// Shared test utilities.
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';

// Wipe all data between tests so each test starts from a clean state.
// Order respects foreign keys (tasks -> projects -> users).
export async function resetDatabase(): Promise<void> {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

// Register a user and return a valid Bearer token.
export async function registerAndLogin(email: string): Promise<string> {
  await request(app).post('/auth/register').send({ name: 'Test User', email, password: 'password123' });
  const res = await request(app).post('/auth/login').send({ email, password: 'password123' });
  return res.body.token as string;
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
