import env from '../config/env.config.js';
import logger from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Centralized production error handling middleware.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  // Structured logging of error
  logger.error({
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
    isOperational: err.isOperational || false
  });

  // Client-facing response
  const message = (err.isOperational || statusCode < 500) ? err.message : 'Internal Server Error';

  return errorResponse(res, {
    statusCode,
    message,
    errors: env.isDevelopment ? { message: err.message, stack: err.stack } : undefined
  });
}

export default errorHandler;
