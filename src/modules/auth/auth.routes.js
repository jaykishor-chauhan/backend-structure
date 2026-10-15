import { Router } from 'express';
import { register, login, getProfile } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateBody } from '../../middlewares/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes
router.post('/register', validateBody(['name', 'email', 'password']), asyncHandler(register));
router.post('/login', validateBody(['email', 'password']), asyncHandler(login));

// Protected routes
router.get('/me', authenticate, asyncHandler(getProfile));

export default router;
