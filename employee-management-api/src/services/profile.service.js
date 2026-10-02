const UserRepository = require('../repositories/user.repository');
const { comparePassword, hashPassword } = require('../utils/password');

class ProfileService {
  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
    };
  }

  async updateProfile(userId, payload) {
    const user = await UserRepository.update(userId, payload);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      const error = new Error('Old password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    await UserRepository.update(userId, { password: hashedPassword });
    return { success: true };
  }
}

module.exports = new ProfileService();
