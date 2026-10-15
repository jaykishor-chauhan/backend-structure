import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import env from './config/env.config.js';
import logger from './utils/logger.js';
import apiRoutes from './routes/index.js';
import notFoundHandler from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import { successResponse } from './utils/apiResponse.js';
  
// Initialize Express app
const app = express();

// Trust reverse proxy (e.g. Nginx, Cloudflare, AWS ALB) for secure cookies & accurate client IP
app.set('trust proxy', 1);

// 1. Security HTTP headers
app.use(helmet());

// 2. Appropriate CORS configuration
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching origin
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Rate limiting (prevents DDoS and brute-force attacks)
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// 4. Body parsers with payload size limits (prevents payload flood attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Structured HTTP logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!env.isTest) {
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    }
  });
  next();
});

// Root health check endpoint (used by Docker, Kubernetes, Load Balancers)
app.get('/health', (req, res) => {
  return successResponse(res, {
    message: 'API Server is Running Healthy!',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Root discovery endpoint
app.get('/', (req, res) => {
  return successResponse(res, {
    message: 'API Server is Live',
    data: {
      version: '1.0.0'
    }
  });
});

// Mount modular API routes under /api/v1
app.use('/api/v1', apiRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
