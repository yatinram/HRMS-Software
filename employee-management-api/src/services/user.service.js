const UserRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password');
const { buildPagination } = require('../utils/pagination');

class UserService {
  async listUsers({ page = 1, limit = 10, role, isActive } = {}) {
    const where = {};
    if (role) where.role = role;
    if (typeof isActive !== 'undefined') where.isActive = isActive;

    const offset = (Number(page) - 1) * Number(limit);
    const result = await UserRepository.findAll({
      where,
      offset,
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    });

    return {
      data: result.rows,
      pagination: buildPagination({
        page: Number(page),
        limit: Number(limit),
        total: result.count,
      }),
    };
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(payload) {
    const existing = await UserRepository.findByEmail(payload.email);
    if (existing) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    const password = await hashPassword(payload.password);
    return UserRepository.create({
      ...payload,
      password,
    });
  }

  async updateUser(id, payload) {
    const user = await UserRepository.update(id, payload);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateUserStatus(id, isActive) {
    const user = await UserRepository.update(id, { isActive });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async changeUserRole(id, role) {
    const user = await UserRepository.update(id, { role });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async deleteUser(id) {
    const user = await UserRepository.destroy(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new UserService();
