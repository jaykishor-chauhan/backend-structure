import { Router } from 'express';
import {
  uploadObject,
  listObjects,
  getPresignedDownloadUrl,
  getStorageStatus
} from '../../config/storage.config.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

const router = Router();

// GET /api/v1/storage/status
router.get('/status', async (req, res, next) => {
  try {
    const status = await getStorageStatus();
    return successResponse(res, {
      message: 'Neon storage status retrieved',
      data: status
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/storage/files
router.get('/files', async (req, res, next) => {
  try {
    const prefix = req.query.prefix || '';
    const files = await listObjects({ prefix });
    return successResponse(res, {
      message: 'Objects listed successfully',
      data: files
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/storage/upload
router.post('/upload', async (req, res, next) => {
  try {
    const { key, content, contentType } = req.body;
    if (!key || !content) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Both key and content are required'
      });
    }

    await uploadObject({
      key,
      body: content,
      contentType: contentType || 'text/plain'
    });

    const presignedUrl = await getPresignedDownloadUrl({ key });

    return successResponse(res, {
      statusCode: 201,
      message: 'File uploaded to Neon Object Storage successfully',
      data: {
        key,
        presignedUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/storage/url/:key
router.get('/url/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const url = await getPresignedDownloadUrl({ key });
    return successResponse(res, {
      message: 'Presigned URL generated',
      data: { key, url }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
