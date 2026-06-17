// Prisma configuration (Prisma 7+).
// Replaces the old `package.json#prisma` key and the `url` in schema.prisma.
// The CLI/Migrate reads the connection URL from here; the application connects
// through a driver adapter (see src/database/prisma.ts).
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
