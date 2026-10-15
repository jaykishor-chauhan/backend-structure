// 2. user.repository.js: Encapsulates direct database queries
import { sampleUsersDB } from './user.model.js';

export const userRepository = {
  // Find all users from database
  async findAll() {
    return sampleUsersDB;
  },

  // Find single user by ID
  async findById(id) {
    return sampleUsersDB.find(user => user.id === id) || null;
  },

  // Find user by email
  async findByEmail(email) {
    return sampleUsersDB.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Insert a new user into database
  async create(userData) {
    const newUser = {
      id: String(sampleUsersDB.length + 1),
      ...userData
    };
    sampleUsersDB.push(newUser);
    return newUser;
  }
};

export default userRepository;
