// Structured logging with pino.
// In development we pretty-print; in production we emit JSON to stdout.
import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
});
