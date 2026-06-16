// A single, shared PrismaClient instance for the whole app.
// Creating many clients would exhaust the database connection pool.
//
// Prisma 7 connects through a driver adapter instead of a `url` in the schema.
// Here we use the PostgreSQL adapter (pg) with the validated DATABASE_URL.
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
