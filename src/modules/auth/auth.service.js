import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.config.js';

// Initial seed storage for mock / development
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

export async function registerUser({ name, email, password, role = 'user' }) {
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    error.isOperational = true;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: String(users.length + 1),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const token = generateToken(newUser);
  const { passwordHash: _, ...safeUser } = newUser;

  return { user: safeUser, token };
}

export async function loginUser({ email, password }) {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.isOperational = true;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.isOperational = true;
    throw error;
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, token };
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

export { users };

export default {
  registerUser,
  loginUser,
  generateToken,
  users
};
