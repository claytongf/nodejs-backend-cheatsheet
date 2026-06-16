// Seed script: creates a demo admin and a demo user, plus a couple of sample tasks.
// Run: npm run db:seed
// Login with admin@demo.test / password123 or user@demo.test / password123
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.test' },
    update: {},
    create: { name: 'Admin User', email: 'admin@demo.test', passwordHash, role: 'ADMIN' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@demo.test' },
    update: {},
    create: { name: 'Demo User', email: 'user@demo.test', passwordHash },
  });

  if ((await prisma.task.count()) === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Read the documentation' },
        { title: 'Build the Task Manager API', status: 'IN_PROGRESS' },
      ],
    });
  }

  console.log('Seed complete:', {
    admin: admin.email,
    user: user.email,
    tasks: await prisma.task.count(),
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
