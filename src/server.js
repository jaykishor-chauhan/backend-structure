import app from './app.js';
import env from './config/env.config.js';
import { connectDatabase, disconnectDatabase } from './config/db.config.js';
import logger from './utils/logger.js';

let server;

async function startServer() {
  try {
    // 1. Establish database connection pool
    await connectDatabase();

    // 2. Start HTTP server
    server = app.listen(env.PORT, () => {
      logger.info({
        message: 'Server started successfully',
        api: `http://localhost:${env.PORT}/v1`,
        healthCheck: `http://localhost:${env.PORT}/health`
      });
    });
  } catch (error) {
    logger.fatal({ message: 'Fatal error during server startup', error: error.message });
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler for SIGTERM and SIGINT.
 * Allows active in-flight requests to finish while rejecting new ones.
 */
let isShuttingDown = false;

async function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ message: `Received ${signal}. Starting graceful shutdown...` });

  // Fallback timer: force exit if cleanup takes longer than 10 seconds
  const forceShutdownTimer = setTimeout(() => {
    logger.error({ message: 'Forced shutdown: cleanup took too long.' });
    process.exit(1);
  }, 10000);
  forceShutdownTimer.unref();

  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error({ message: 'Error closing HTTP server', error: err.message });
        process.exit(1);
      }

      logger.info({ message: 'HTTP server closed. No longer accepting new connections.' });

      // Cleanly close database connections
      await disconnectDatabase();

      logger.info({ message: 'Graceful shutdown complete. Exiting process.' });
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// OS signals (Docker / Kubernetes send SIGTERM on stop)
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Process-level unhandled errors
process.on('unhandledRejection', (reason) => {
  logger.error({ message: 'Unhandled Promise Rejection', reason });
});

process.on('uncaughtException', (error) => {
  logger.fatal({ message: 'Uncaught Exception! Shutting down immediately.', error: error.message, stack: error.stack });
  process.exit(1);
});

startServer();
