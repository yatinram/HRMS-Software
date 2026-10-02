const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

class UserController {
  async listUsers(req, res, next) {
    try {
      const result = await userService.listUsers(req.query);
      return sendSuccess(res, 'Users fetched successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return sendSuccess(res, 'User fetched successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return sendSuccess(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return sendSuccess(res, 'User updated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
      return sendSuccess(res, 'User status updated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  async changeRole(req, res, next) {
    try {
      const user = await userService.changeUserRole(req.params.id, req.body.role);
      return sendSuccess(res, 'User role updated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await userService.deleteUser(req.params.id);
      return sendSuccess(res, 'User deleted successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
