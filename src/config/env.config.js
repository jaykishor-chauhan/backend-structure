import 'dotenv/config';

const ENV_NODE = process.env.ENV_NODE || 'development';

const isProduction = ENV_NODE === 'production';
const isDevelopment = ENV_NODE === 'development';
const isTest = ENV_NODE === 'test';

const requiredEnv = (key) => {
  const value = process.env[key];

  if (!value && isProduction) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const JWT_SECRET = requiredEnv('JWT_SECRET');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (isProduction && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production.');
}

if (typeof JWT_EXPIRES_IN !== 'string' && !Number.isInteger(JWT_EXPIRES_IN)) {
  throw new Error('JWT_EXPIRES_IN must be a valid time string or integer.');
}

const PORT = Number(process.env.PORT || 5001);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

if (!Number.isInteger(RATE_LIMIT_WINDOW_MS) || RATE_LIMIT_WINDOW_MS <= 0) {
  throw new Error('RATE_LIMIT_WINDOW_MS must be a positive integer.');
}

if (!Number.isInteger(RATE_LIMIT_MAX) || RATE_LIMIT_MAX <= 0) {
  throw new Error('RATE_LIMIT_MAX must be a positive integer.');
}

// Database configuration (PostgreSQL on Neon)
const DATABASE_URL = requiredEnv('DATABASE_URL') || '';
const DATABASE_URL_UNPOOLED = process.env.DATABASE_URL_UNPOOLED || DATABASE_URL;
const NEON_BRANCH = process.env.NEON_BRANCH || 'production';

// Neon Object Storage configuration (S3-compatible)
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_ENDPOINT_URL_S3 = process.env.AWS_ENDPOINT_URL_S3 || '';
const AWS_REGION = process.env.AWS_REGION || 'ap-southeast-1';
const NEON_BUCKET = process.env.NEON_BUCKET || 'assets';

const CORS_ORIGIN = isProduction ? requiredEnv('CORS_ORIGIN') : process.env.CORS_ORIGIN || '*';

export const env = Object.freeze({
  PORT,
  ENV_NODE,
  isProduction,
  isDevelopment,
  isTest,
  CORS_ORIGIN,
  DATABASE_URL,
  DATABASE_URL_UNPOOLED,
  NEON_BRANCH,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_ENDPOINT_URL_S3,
  AWS_REGION,
  NEON_BUCKET,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
});

export default env;
