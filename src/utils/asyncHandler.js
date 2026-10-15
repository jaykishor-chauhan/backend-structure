/**
 * Wraps an async route handler to catch errors and forward them to Express next().
 * Eliminates repetitive try-catch blocks in controllers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
