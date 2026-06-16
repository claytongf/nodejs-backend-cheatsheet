// 09 · Prisma CRUD — requires the database to be running.
// Setup once:
//   docker compose up -d
//   npm run prisma:migrate
// Run:
//   npx tsx examples/09-prisma-crud/index.ts
//
// This reuses the project's Prisma schema (User/Project/Task).

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // CREATE
  const user = await prisma.user.create({
    data: {
      name: 'Example User',
      email: `example-${Date.now()}@demo.test`,
      passwordHash: 'not-a-real-hash',
    },
  });
  console.log('Created user:', user.id);

  // CREATE a related project
  const project = await prisma.project.create({
    data: { name: 'Demo Project', ownerId: user.id },
  });

  // READ with relation (avoids N+1)
  const withTasks = await prisma.project.findUnique({
    where: { id: project.id },
    include: { tasks: true },
  });
  console.log('Project with tasks:', withTasks?.name, withTasks?.tasks.length);

  // UPDATE
  await prisma.project.update({
    where: { id: project.id },
    data: { description: 'Updated from the CRUD example' },
  });

  // DELETE (clean up)
  await prisma.project.delete({ where: { id: project.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleaned up. Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
