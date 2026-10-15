import { Router } from 'express';
import {
  getPortfolioItems,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  removePortfolioItem
} from './portfolio.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validateBody } from '../../middlewares/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public routes for portfolio display
router.get('/', asyncHandler(getPortfolioItems));
router.get('/:id', asyncHandler(getPortfolioItem));

// Protected routes (Admin / authorized users manage portfolio projects)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateBody(['title', 'description']),
  asyncHandler(createPortfolioItem)
);
router.put('/:id', authenticate, authorize('admin'), asyncHandler(updatePortfolioItem));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(removePortfolioItem));

export default router;
