import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
