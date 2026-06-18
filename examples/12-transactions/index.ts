// 12 · Database transactions — requires the database to be running.
// Setup once:
//   docker compose up -d
//   npm run prisma:migrate
// Run:
//   npx tsx examples/12-transactions/index.ts
//
// A transaction makes several writes succeed or fail TOGETHER (atomicity). If any step
// throws, every write inside the transaction is rolled back as if none happened.
//
// Classic interview question: "How do you create a record and its children atomically?"
// Answer: an interactive transaction — prisma.$transaction(async (tx) => { ... }). Use the
// `tx` client (not the global `prisma`) for every write so they share one transaction.
//
// Note: the app's repository already uses the *array* form `prisma.$transaction([a, b])` to
// run a findMany + count consistently (see src/modules/projects/projects.repository.ts).
// This example shows the *interactive callback* form, which is what you need for multi-write
// business operations. See docs/09-database-prisma-postgresql.md.

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Create a project together with its initial tasks, atomically.
// If `failHalfway` is true we throw after creating one task, to prove the project and the
// first task are both rolled back.
async function createProjectWithTasks(
  ownerId: string,
  name: string,
  taskTitles: string[],
  failHalfway = false,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({ data: { name, ownerId } });

    for (const [index, title] of taskTitles.entries()) {
      await tx.task.create({ data: { title, projectId: project.id, ownerId } });
      if (failHalfway && index === 0) {
        // Something goes wrong (e.g. a validation rule, a downstream check).
        throw new Error('Simulated failure after the first task');
      }
    }

    return project;
  });
}

async function main() {
  const owner = await prisma.user.create({
    data: {
      name: 'Tx Owner',
      email: `tx-${Date.now()}@demo.test`,
      passwordHash: 'not-a-real-hash',
    },
  });

  // 1) Happy path: project + two tasks are committed together.
  const project = await createProjectWithTasks(owner.id, 'Committed project', ['Task A', 'Task B']);
  const committed = await prisma.task.count({ where: { projectId: project.id } });
  console.log(`✅ Committed: project created with ${committed} tasks`);

  // 2) Failure path: the whole transaction rolls back, so NO project is left behind.
  const before = await prisma.project.count({ where: { ownerId: owner.id } });
  try {
    await createProjectWithTasks(owner.id, 'Doomed project', ['Task C', 'Task D'], true);
  } catch (err) {
    console.log(`↩️  Rolled back as expected: ${(err as Error).message}`);
  }
  const after = await prisma.project.count({ where: { ownerId: owner.id } });
  console.log(`   Projects before failed tx: ${before}, after: ${after} (unchanged → rolled back)`);

  // Clean up (deleting the user cascades to projects/tasks via the schema).
  await prisma.task.deleteMany({ where: { project: { ownerId: owner.id } } });
  await prisma.project.deleteMany({ where: { ownerId: owner.id } });
  await prisma.user.delete({ where: { id: owner.id } });
  console.log('Cleaned up. Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
