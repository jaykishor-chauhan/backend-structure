import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import portfolioRoutes from '../modules/portfolio/portfolio.routes.js';
import storageRoutes from '../modules/storage/storage.routes.js';
import { getDatabaseStatus } from '../config/db.config.js';
import { getStorageStatus } from '../config/storage.config.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

// Modular API routes registration
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/storage', storageRoutes);

// API v1 Health & Info Route
router.get('/health', async (req, res, next) => {
  try {
    const dbStatus = getDatabaseStatus();
    const storageStatus = await getStorageStatus();

    return successResponse(res, {
      message: 'API v1 is operational with Neon Cloud Services',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          postgres: dbStatus,
          objectStorage: storageStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
