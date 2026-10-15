/**
 * Standardized API response helpers.
 */
export function successResponse(res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) {
  const payload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta })
  };
  return res.status(statusCode).json(payload);
}

export function errorResponse(res, { statusCode = 500, message = 'Internal Server Error', errors = null } = {}) {
  const payload = {
    success: false,
    message,
    ...(errors !== null && { errors })
  };
  return res.status(statusCode).json(payload);
}

export default {
  successResponse,
  errorResponse
};
