// 5. user.controller.js: Handles HTTP requests and responses
import { userService } from './user.service.js';

export const userController = {
  // GET /api/v1/users
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/users/:id
  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/v1/users
  async createUser(req, res, next) {
    try {
      const newUser = await userService.createUser(req.body);
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }
};

export default userController;
