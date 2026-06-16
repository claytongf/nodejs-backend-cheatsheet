// Seed script: inserts a couple of sample tasks if the table is empty.
// Run: npm run db:seed
// More seed data (users, projects) is added in later phases.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.task.count();
  if (existing === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Read the documentation' },
        { title: 'Build the Task Manager API', status: 'IN_PROGRESS' },
      ],
    });
  }
  console.log('Seed complete. Total tasks:', await prisma.task.count());
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
