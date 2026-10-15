import { errorResponse } from '../utils/apiResponse.js';

/**
 * Handle 404 for undefined routes.
 */
export function notFoundHandler(req, res, next) {
  return errorResponse(res, {
    statusCode: 404,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

export default notFoundHandler;
