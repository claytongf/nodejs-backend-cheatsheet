// Temporary entry point for the project foundation.
// It loads environment variables and prints the configured port.
// In the next phase this is replaced by a real Express app (app.ts + server.ts).
/* eslint-disable no-console -- this temporary entry point intentionally logs to stdout */
import 'dotenv/config';

const port = process.env.PORT ?? '3000';

console.log('✅ Node.js + TypeScript backend foundation is ready.');
console.log(`   Configured PORT = ${port}`);
console.log('   Next phase: add the Express app (health check, middlewares).');
