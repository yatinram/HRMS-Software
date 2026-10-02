const crypto = require('crypto');
const { User, Employee } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { ROLES } = require('../constants/roles');
const {
  DUPLICATE_EMAIL,
  INVALID_CREDENTIALS,
  ACCOUNT_INACTIVE,
  RESET_TOKEN_INVALID,
} = require('../constants/messages');

class AuthService {
  async register(payload) {
    const existingUser = await User.findOne({ where: { email: payload.email } });
    if (existingUser) {
      const error = new Error(DUPLICATE_EMAIL);
      error.statusCode = 409;
      throw error;
    }

    const password = await hashPassword(payload.password);
    const user = await User.create({
      ...payload,
      password,
      role: payload.role || ROLES.EMPLOYEE,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(payload) {
    // Unscoped to allow password validation
    const user = await User.unscoped().findOne({ where: { email: payload.email } });
    if (!user) {
      const error = new Error(INVALID_CREDENTIALS);
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(payload.password, user.password);
    if (!isMatch) {
      const error = new Error(INVALID_CREDENTIALS);
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error(ACCOUNT_INACTIVE);
      error.statusCode = 401;
      throw error;
    }

    // Check if user has an associated employee profile
    const employee = await Employee.findOne({ where: { email: user.email } });

    const token = signToken({
      userId: user.id,
      role: user.role,
      employeeId: employee ? employee.id : null,
    });

    await User.update({ lastLogin: new Date() }, { where: { id: user.id } });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        employeeId: employee ? employee.id : null,
        employeeCode: employee ? employee.employeeId : null,
        department: employee ? employee.department : null,
        designation: employee ? employee.designation : null,
      },
    };
  }

  async getMe(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const employee = await Employee.findOne({ where: { email: user.email } });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      employeeId: employee ? employee.id : null,
      employeeCode: employee ? employee.employeeId : null,
      department: employee ? employee.department : null,
      designation: employee ? employee.designation : null,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.unscoped().findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId, payload) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = ['name', 'phone', 'profileImage'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) updateData[field] = payload[field];
    });

    await User.update(updateData, { where: { id: userId } });
    return this.getMe(userId);
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.update(
      { resetPasswordToken: resetToken, resetPasswordExpires: expiry },
      { where: { email } }
    );

    return {
      message: 'Password reset instructions sent',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  async resetPassword({ token, newPassword }) {
    const target = await User.unscoped().findOne({
      where: { resetPasswordToken: token },
    });

    if (
      !target ||
      !target.resetPasswordExpires ||
      new Date(target.resetPasswordExpires) < new Date()
    ) {
      const error = new Error(RESET_TOKEN_INVALID);
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.update(
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id: target.id } }
    );

    return { success: true, message: 'Password has been reset successfully' };
  }
}

module.exports = new AuthService();
