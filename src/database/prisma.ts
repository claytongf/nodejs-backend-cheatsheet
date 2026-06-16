// A single, shared PrismaClient instance for the whole app.
// Creating many clients would exhaust the database connection pool.
// (Log configuration based on the environment is added in a later phase.)
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
