import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import env from './env.config.js';
import logger from '../utils/logger.js';

// Configure WebSocket for Node.js runtime connection pooling with Neon
neonConfig.webSocketConstructor = ws;

let isConnected = false;
let dbInfo = null;
let pool = null;

export const dbConfig = {
  url: env.DATABASE_URL,
  unpooledUrl: env.DATABASE_URL_UNPOOLED,
  branch: env.NEON_BRANCH
};

/**
 * Initialize Neon PostgreSQL connection pool and verify connectivity.
 */
export async function connectDatabase() {
  try {
    logger.info({ message: 'Connecting to Neon PostgreSQL database...' });

    if (!pool && env.DATABASE_URL) {
      pool = new Pool({
        connectionString: env.DATABASE_URL
      });
    }

    if (pool) {
      const result = await pool.query('SELECT current_database() as database');
      dbInfo = result.rows[0];
      isConnected = true;
      logger.info({
        message: 'Neon PostgreSQL database connected successfully',
        database: dbInfo.database
      });
      return true;
    }

    isConnected = false;
    return false;
  } catch (error) {
    isConnected = false;
    logger.error({ message: 'Failed to connect to Neon PostgreSQL database', error: error.message });
    if (env.isProduction) {
      process.exit(1);
    }
    return false;
  }
}

/**
 * Execute a query against the Neon PostgreSQL database pool.
 */
export async function query(text, params) {
  if (!pool) {
    throw new Error('Database connection pool is not initialized');
  }
  return pool.query(text, params);
}

/**
 * Disconnect Neon PostgreSQL connection pool cleanly during shutdown.
 */
export async function disconnectDatabase() {
  try {
    if (pool) {
      logger.info({ message: 'Closing Neon PostgreSQL connection pool...' });
      await pool.end();
      pool = null;
      isConnected = false;
      logger.info({ message: 'Neon PostgreSQL connection pool closed cleanly' });
    }
  } catch (error) {
    logger.error({ message: 'Error closing Neon PostgreSQL connection pool', error: error.message });
  }
}

/**
 * Return current health and metadata status of the database connection.
 */
export function getDatabaseStatus() {
  return {
    provider: 'Neon (Lakebase Postgres)',
    connected: isConnected,
    branch: env.NEON_BRANCH,
    database: dbInfo ? dbInfo.database : null,
    serverTime: dbInfo ? dbInfo.current_time : null,
    url: env.DATABASE_URL ? env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : null
  };
}

export { pool };

export default {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
  query,
  pool,
  dbConfig
};
