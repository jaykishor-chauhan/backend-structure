import { errorResponse } from '../utils/apiResponse.js';

/**
 * Validates that required fields are present in request body.
 * @param {string[]} requiredFields - List of required field names
 */
export function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed: missing required fields',
        errors: missing.map(field => `${field} is required`)
      });
    }

    next();
  };
}

export default {
  validateBody
};
