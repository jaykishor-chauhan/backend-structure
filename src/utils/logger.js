import pino from 'pino';
import env from '../config/env.config.js';

/**
 * Structured production logger using Pino.
 * Generates JSON logs in production (ideal for Datadog, CloudWatch, ELK)
 * and formatted logs in development.
 */
export const logger = pino({
  base: undefined, // Removes pid and hostname
  timestamp: false, // Replaced by the initial key in formatters.level to avoid extra commas
  formatters: {
    level: () => ({ time: new Date().toISOString() }) // Outputs timestamp as the first key, omitting level
  },
  redact: {
    paths: ['req.headers.authorization', 'password', 'token', '*.password'],
    censor: '[REDACTED]'
  }
});

export default logger;
