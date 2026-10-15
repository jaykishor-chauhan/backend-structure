import { describe, it } from 'node:test';
import assert from 'node:assert';
import { registerUser, loginUser } from '../src/modules/auth/auth.service.js';

describe('Auth Service', () => {
  const testUser = {
    name: 'Test Engineer',
    email: `tester_${Date.now()}@example.com`,
    password: 'SecurePassword123!',
    role: 'user'
  };

  it('should register a new user successfully and return JWT token', async () => {
    const result = await registerUser(testUser);
    assert.ok(result.token);
    assert.strictEqual(result.user.email, testUser.email.toLowerCase());
    assert.strictEqual(result.user.name, testUser.name);
    assert.strictEqual(result.user.passwordHash, undefined, 'Password hash should be stripped from output');
  });

  it('should fail when registering duplicate email', async () => {
    await assert.rejects(
      async () => {
        await registerUser(testUser);
      },
      {
        message: 'User with this email already exists'
      }
    );
  });

  it('should log in existing user with correct credentials', async () => {
    const loginResult = await loginUser({
      email: testUser.email,
      password: testUser.password
    });

    assert.ok(loginResult.token);
    assert.strictEqual(loginResult.user.email, testUser.email.toLowerCase());
  });

  it('should reject login with incorrect password', async () => {
    await assert.rejects(
      async () => {
        await loginUser({
          email: testUser.email,
          password: 'WrongPassword!'
        });
      },
      {
        message: 'Invalid email or password'
      }
    );
  });
});
