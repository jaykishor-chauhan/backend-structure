import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from './env.config.js';
import logger from '../utils/logger.js';

let s3Client = null;

if (env.AWS_ENDPOINT_URL_S3 && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    endpoint: env.AWS_ENDPOINT_URL_S3,
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true // Required for Neon Object Storage
  });
}

/**
 * Upload an object to a Neon Object Storage bucket.
 */
export async function uploadObject({ bucket = env.NEON_BUCKET, key, body, contentType = 'application/octet-stream' }) {
  if (!s3Client) {
    throw new Error('Neon Object Storage client is not configured');
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType
  });

  const response = await s3Client.send(command);
  logger.info({ message: 'Object uploaded to Neon storage', bucket, key });
  return response;
}

/**
 * Retrieve an object stream from a Neon Object Storage bucket.
 */
export async function getObject({ bucket = env.NEON_BUCKET, key }) {
  if (!s3Client) {
    throw new Error('Neon Object Storage client is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return s3Client.send(command);
}

/**
 * List objects within a Neon Object Storage bucket.
 */
export async function listObjects({ bucket = env.NEON_BUCKET, prefix = '', maxKeys = 100 } = {}) {
  if (!s3Client) {
    throw new Error('Neon Object Storage client is not configured');
  }

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
    MaxKeys: maxKeys
  });

  const response = await s3Client.send(command);
  return {
    bucket,
    prefix,
    objects: (response.Contents || []).map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag
    }))
  };
}

/**
 * Delete an object from a Neon Object Storage bucket.
 */
export async function deleteObject({ bucket = env.NEON_BUCKET, key }) {
  if (!s3Client) {
    throw new Error('Neon Object Storage client is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return s3Client.send(command);
}

/**
 * Generate a presigned download URL for an object in a private Neon bucket.
 */
export async function getPresignedDownloadUrl({ bucket = env.NEON_BUCKET, key, expiresIn = 3600 }) {
  if (!s3Client) {
    throw new Error('Neon Object Storage client is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Check connectivity and retrieve status of Neon Object Storage.
 */
export async function getStorageStatus() {
  if (!s3Client) {
    return {
      provider: 'Neon Object Storage',
      configured: false,
      connected: false,
      error: 'Missing storage credentials'
    };
  }

  try {
    const res = await s3Client.send(new ListBucketsCommand({}));
    return {
      provider: 'Neon Object Storage (S3-compatible)',
      configured: true,
      connected: true,
      endpoint: env.AWS_ENDPOINT_URL_S3,
      region: env.AWS_REGION,
      defaultBucket: env.NEON_BUCKET,
      buckets: (res.Buckets || []).map(b => b.Name)
    };
  } catch (error) {
    return {
      provider: 'Neon Object Storage',
      configured: true,
      connected: false,
      error: error.message
    };
  }
}

export { s3Client };

export default {
  uploadObject,
  getObject,
  listObjects,
  deleteObject,
  getPresignedDownloadUrl,
  getStorageStatus,
  s3Client
};
