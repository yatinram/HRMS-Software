const profileService = require('../services/profile.service');
const { sendSuccess } = require('../utils/response');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id);
      return sendSuccess(res, 'Profile fetched successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await profileService.updateProfile(req.user.id, req.body);
      return sendSuccess(res, 'Profile updated successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await profileService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
      return sendSuccess(res, 'Password changed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
