import { registerUser, loginUser } from './auth.service.js';
import { successResponse } from '../../utils/apiResponse.js';

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  const result = await registerUser({ name, email, password, role });
  return successResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: result
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  return successResponse(res, {
    statusCode: 200,
    message: 'Login successful',
    data: result
  });
}

export async function getProfile(req, res) {
  return successResponse(res, {
    statusCode: 200,
    message: 'Current authenticated user profile',
    data: req.user
  });
}

export default {
  register,
  login,
  getProfile
};
