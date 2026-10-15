// 6. user.routes.js: Defines API endpoints
import { Router } from 'express';
import { userController } from './user.controller.js';
import { validateCreateUser } from './user.validation.js';

const router = Router();

// Route: Get all users
router.get('/', userController.getUsers);

// Route: Get single user by ID
router.get('/:id', userController.getUser);

// Route: Create user (with validation middleware)
router.post('/', validateCreateUser, userController.createUser);

export default router;
