import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Authentication failed. Please try again.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Unauthorized. Please try again.',
      errors: error.message
    });
  }
}

/**
 * Middleware to enforce role-based access control (RBAC).
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, {
        statusCode: 403,
        message: 'Forbidden: Insufficient privileges'
      });
    }
    next();
  };
}

export default {
  authenticate,
  authorize
};
