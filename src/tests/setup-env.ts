// Runs before any test module is imported (see jest.config.js setupFiles).
// Loads .env.test so the Prisma client and JWT helpers use the test database.
// dotenv does not override variables already set (e.g. by CI), which is what we want.
import { config } from 'dotenv';

config({ path: '.env.test' });
