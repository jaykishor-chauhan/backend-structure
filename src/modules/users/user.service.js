// 3. user.service.js: Implements business logic
import { userRepository } from './user.repository.js';

export const userService = {
  // Get all users
  async getAllUsers() {
    return await userRepository.findAll();
  },

  // Get user by ID with business checks
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error(`User not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  // Create user with business verification
  async createUser({ name, email, role = 'user' }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    // Call repository to save
    return await userRepository.create({ name, email, role });
  }
};

export default userService;
