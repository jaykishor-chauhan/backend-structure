// 4. user.validation.js: Validates incoming request data
export function validateCreateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: "name" is required and must be a string'
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: A valid "email" is required'
    });
  }

  next();
}

export default {
  validateCreateUser
};
