// Dedicated tests for the projects module's full CRUD lifecycle.
//
// Cross-module behavior (creating tasks inside a project, ownership 403s, the paginated
// list envelope) is covered in tasks.test.ts. Here we focus on the project resource itself:
// update, delete, and the not-found / validation failure paths the other suite does not hit.
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';
import { resetDatabase, registerAndLogin, bearer } from './helpers.js';

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Projects CRUD', () => {
  it('creates, reads, updates, then deletes a project', async () => {
    const token = await registerAndLogin('crud@example.com');

    const created = await request(app)
      .post('/projects')
      .set(bearer(token))
      .send({ name: 'Initial name' });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const fetched = await request(app).get(`/projects/${id}`).set(bearer(token));
    expect(fetched.status).toBe(200);
    expect(fetched.body.name).toBe('Initial name');

    const updated = await request(app)
      .patch(`/projects/${id}`)
      .set(bearer(token))
      .send({ name: 'Renamed project' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Renamed project');

    const deleted = await request(app).delete(`/projects/${id}`).set(bearer(token));
    expect(deleted.status).toBe(204);

    // After deletion the project is gone.
    const gone = await request(app).get(`/projects/${id}`).set(bearer(token));
    expect(gone.status).toBe(404);
  });

  it('returns 404 for a project that does not exist', async () => {
    const token = await registerAndLogin('missing@example.com');
    const res = await request(app)
      .get('/projects/00000000-0000-0000-0000-000000000000')
      .set(bearer(token));
    expect(res.status).toBe(404);
  });

  it('rejects creating a project with an invalid name (422)', async () => {
    const token = await registerAndLogin('bad-create@example.com');
    const res = await request(app).post('/projects').set(bearer(token)).send({ name: 'x' });
    expect(res.status).toBe(422);
  });

  it('rejects updating with an invalid name (422)', async () => {
    const token = await registerAndLogin('bad-update@example.com');
    const created = await request(app)
      .post('/projects')
      .set(bearer(token))
      .send({ name: 'Valid name' });
    const res = await request(app)
      .patch(`/projects/${created.body.id}`)
      .set(bearer(token))
      .send({ name: 'x' });
    expect(res.status).toBe(422);
  });

  it('forbids updating another user\'s project (403)', async () => {
    const ownerToken = await registerAndLogin('owner2@example.com');
    const otherToken = await registerAndLogin('intruder@example.com');

    const created = await request(app)
      .post('/projects')
      .set(bearer(ownerToken))
      .send({ name: 'Owned project' });

    const res = await request(app)
      .patch(`/projects/${created.body.id}`)
      .set(bearer(otherToken))
      .send({ name: 'Hijacked' });
    expect(res.status).toBe(403);
  });
});
