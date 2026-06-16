// The runtime entry point: starts the HTTP server and handles graceful shutdown.
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './database/prisma.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Close connections cleanly when the platform sends a stop signal.
async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received — shutting down gracefully...`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    void shutdown(signal);
  });
}
