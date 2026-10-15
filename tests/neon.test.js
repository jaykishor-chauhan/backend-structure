import { describe, it } from 'node:test';
import assert from 'node:assert';
import { connectDatabase, disconnectDatabase, query, getDatabaseStatus } from '../src/config/db.config.js';
import { uploadObject, listObjects, getPresignedDownloadUrl, getStorageStatus, deleteObject } from '../src/config/storage.js';

describe('Neon Services End-to-End Tests', () => {
  it('should connect to Neon Lakebase Postgres and execute queries', async () => {
    const connected = await connectDatabase();
    assert.strictEqual(connected, true, 'Database should connect successfully');

    const status = getDatabaseStatus();
    assert.strictEqual(status.connected, true);
    assert.strictEqual(status.provider, 'Neon (Lakebase Postgres)');

    const result = await query('SELECT 1 + 1 AS sum, current_database() as db');
    assert.strictEqual(result.rows[0].sum, 2);
    assert.ok(result.rows[0].db);

    await disconnectDatabase();
  });

  it('should verify Neon Object Storage connectivity and upload/list/delete objects', async () => {
    const status = await getStorageStatus();
    assert.strictEqual(status.connected, true, 'Neon Object Storage should be connected');
    assert.ok(status.buckets.includes('assets'), 'Assets bucket should exist');

    const testKey = `test-upload-${Date.now()}.txt`;
    const testContent = 'Hello from Neon Object Storage Integration Test!';

    // Upload
    await uploadObject({
      key: testKey,
      body: testContent,
      contentType: 'text/plain'
    });

    // List
    const files = await listObjects({ prefix: testKey });
    assert.ok(files.objects.some(f => f.key === testKey), 'Uploaded object should appear in list');

    // Presigned URL
    const presignedUrl = await getPresignedDownloadUrl({ key: testKey });
    assert.ok(presignedUrl.startsWith('https://'), 'Presigned URL should be HTTPS URL');

    // Delete test object
    await deleteObject({ key: testKey });
  });
});
