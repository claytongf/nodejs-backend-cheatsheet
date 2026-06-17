import { config } from 'dotenv';
import { Client } from 'pg';

config({ path: '.env.test' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required in .env.test');
}

const testDatabaseUrl = new URL(databaseUrl);
const testDatabaseName = testDatabaseUrl.pathname.replace(/^\//, '');

if (!testDatabaseName) {
  throw new Error('DATABASE_URL must include a database name');
}

const adminDatabaseUrl = new URL(databaseUrl);
adminDatabaseUrl.pathname = '/postgres';
adminDatabaseUrl.search = '';

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

const client = new Client({ connectionString: adminDatabaseUrl.toString() });

try {
  await client.connect();

  const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
    testDatabaseName,
  ]);

  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE ${quoteIdentifier(testDatabaseName)}`);
    console.log(`Created test database "${testDatabaseName}".`);
  } else {
    console.log(`Test database "${testDatabaseName}" already exists.`);
  }
} finally {
  await client.end();
}
