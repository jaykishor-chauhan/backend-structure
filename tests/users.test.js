import { describe, it } from 'node:test';
import assert from 'node:assert';
import { userService } from '../src/modules/users/user.service.js';

describe('User Module (Sample Architecture)', () => {
  it('should list all sample users', async () => {
    const users = await userService.getAllUsers();
    assert.ok(Array.isArray(users));
    assert.ok(users.length >= 2);
  });

  it('should find single user by ID', async () => {
    const user = await userService.getUserById('1');
    assert.strictEqual(user.id, '1');
    assert.strictEqual(user.name, 'Alice Johnson');
  });

  it('should create a new user via service & repository', async () => {
    const newUser = await userService.createUser({
      name: 'Charlie Brown',
      email: `charlie_${Date.now()}@example.com`,
      role: 'user'
    });
    assert.ok(newUser.id);
    assert.strictEqual(newUser.name, 'Charlie Brown');
  });

  it('should reject creating user with duplicate email', async () => {
    await assert.rejects(
      async () => {
        await userService.createUser({
          name: 'Alice Duplicate',
          email: 'alice@example.com'
        });
      },
      {
        message: 'Email is already registered'
      }
    );
  });
});
