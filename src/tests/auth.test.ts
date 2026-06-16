import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';
import { resetDatabase } from './helpers.js';

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  it('registers a user (201) and never returns the password hash', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Ada', email: 'ada@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('ada@example.com');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('rejects invalid registration input (422)', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'not-an-email' });
    expect(res.status).toBe(422);
  });

  it('rejects duplicate emails (409)', async () => {
    const payload = { name: 'Ada', email: 'dup@example.com', password: 'password123' };
    await request(app).post('/auth/register').send(payload);
    const res = await request(app).post('/auth/register').send(payload);
    expect(res.status).toBe(409);
  });

  it('logs in and returns the current user via /auth/me', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Ada', email: 'me@example.com', password: 'password123' });

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'me@example.com', password: 'password123' });
    expect(login.status).toBe(200);

    const me = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('me@example.com');
  });

  it('rejects /auth/me without a token (401)', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects bad credentials (401)', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Ada', email: 'creds@example.com', password: 'password123' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'creds@example.com', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });
});
