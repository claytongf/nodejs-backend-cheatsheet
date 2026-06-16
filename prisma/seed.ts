// Seed script: creates a demo admin, a demo user, and some sample data.
// Run: npm run db:seed
// Login with admin@demo.test / password123 or user@demo.test / password123

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

  // Only seed sample content if the demo user has no projects yet.
  const existingProjects = await prisma.project.count({ where: { ownerId: user.id } });
  if (existingProjects === 0) {
    const project = await prisma.project.create({
      data: { name: 'Sample Project', description: 'A seeded project', ownerId: user.id },
    });
    await prisma.task.create({
      data: { title: 'Read the docs', projectId: project.id, ownerId: user.id },
    });
  }

  console.log('Seed complete:', { admin: admin.email, user: user.email });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
