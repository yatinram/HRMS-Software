const AuthService = require('../services/auth.service');
const { sendSuccess, sendCreated } = require('../utils/response');
const { CREATED_SUCCESS, LOGIN_SUCCESS } = require('../constants/messages');

class AuthController {
  async register(req, res, next) {
    try {
      const data = await AuthService.register(req.body);
      return sendCreated(res, CREATED_SUCCESS, data);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const data = await AuthService.login(req.body);
      return sendSuccess(res, LOGIN_SUCCESS, data);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const data = await AuthService.getMe(req.user.userId);
      return sendSuccess(res, 'User profile fetched successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const data = await AuthService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const data = await AuthService.updateProfile(req.user.userId, req.body);
      return sendSuccess(res, 'Profile updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const data = await AuthService.forgotPassword(req.body.email);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const data = await AuthService.resetPassword(req.body);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
