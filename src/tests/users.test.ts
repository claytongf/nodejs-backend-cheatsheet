import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';
import { resetDatabase, registerAndLogin, bearer } from './helpers.js';

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

// Register a user, promote them to ADMIN in the database, then log in so the issued
// JWT carries the ADMIN role (the role is read from the token, not the DB, per request).
async function registerAdminAndLogin(email: string): Promise<string> {
  await request(app)
    .post('/auth/register')
    .send({ name: 'Admin', email, password: 'password123' });
  await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
  const res = await request(app).post('/auth/login').send({ email, password: 'password123' });
  return res.body.token as string;
}

describe('GET /users', () => {
  it('forbids non-admin users (403)', async () => {
    const token = await registerAndLogin('regular@example.com');
    const res = await request(app).get('/users').set(bearer(token));
    expect(res.status).toBe(403);
  });

  it('returns a paginated envelope of public users for admins', async () => {
    const token = await registerAdminAndLogin('admin@example.com');

    const res = await request(app).get('/users?limit=10').set(bearer(token));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toMatchObject({ page: 1, limit: 10 });
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    // Public fields only — the password hash must never leak.
    expect(res.body.data[0].passwordHash).toBeUndefined();
  });

  it('rejects an invalid list query (422)', async () => {
    const token = await registerAdminAndLogin('admin2@example.com');
    const res = await request(app).get('/users?sort=bogus').set(bearer(token));
    expect(res.status).toBe(422);
  });
});
