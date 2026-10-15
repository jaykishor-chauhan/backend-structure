import { describe, it } from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

describe('Health and Root Endpoints', () => {
  it('should initialize express app without error', () => {
    assert.ok(app);
    assert.strictEqual(typeof app.listen, 'function');
  });
});
