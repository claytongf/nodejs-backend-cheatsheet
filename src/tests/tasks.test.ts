import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../database/prisma.js';
import { resetDatabase, registerAndLogin, bearer } from './helpers.js';

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Projects & Tasks', () => {
  it('creates a project and a task, then marks the task complete', async () => {
    const token = await registerAndLogin('owner@example.com');

    const project = await request(app)
      .post('/projects')
      .set(bearer(token))
      .send({ name: 'My Project' });
    expect(project.status).toBe(201);

    const task = await request(app)
      .post('/tasks')
      .set(bearer(token))
      .send({ title: 'First task', projectId: project.body.id });
    expect(task.status).toBe(201);
    expect(task.body.status).toBe('TODO');

    const done = await request(app).patch(`/tasks/${task.body.id}/complete`).set(bearer(token));
    expect(done.status).toBe(200);
    expect(done.body.status).toBe('DONE');
  });

  it('rejects creating a task with invalid input (422)', async () => {
    const token = await registerAndLogin('val@example.com');
    const res = await request(app).post('/tasks').set(bearer(token)).send({ title: 'x' });
    expect(res.status).toBe(422);
  });

  it("forbids accessing another user's project (403)", async () => {
    const ownerToken = await registerAndLogin('a@example.com');
    const otherToken = await registerAndLogin('b@example.com');

    const project = await request(app)
      .post('/projects')
      .set(bearer(ownerToken))
      .send({ name: 'Private' });
    const res = await request(app).get(`/projects/${project.body.id}`).set(bearer(otherToken));
    expect(res.status).toBe(403);
  });

  it('requires authentication for projects (401)', async () => {
    const res = await request(app).get('/projects');
    expect(res.status).toBe(401);
  });

  it("lists only the requesting user's tasks", async () => {
    const token = await registerAndLogin('list@example.com');
    const project = await request(app)
      .post('/projects')
      .set(bearer(token))
      .send({ name: 'Project A' });
    await request(app)
      .post('/tasks')
      .set(bearer(token))
      .send({ title: 'T1', projectId: project.body.id });

    const res = await request(app).get('/tasks').set(bearer(token));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });
});
