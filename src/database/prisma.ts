// A single, shared PrismaClient instance for the whole app.
// Creating many clients would exhaust the database connection pool.
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
