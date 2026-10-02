const User = require('../models/user.model');

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findById(id) {
    return User.unscoped().findByPk(id);
  }

  async findByEmail(email) {
    return User.unscoped().findOne({ where: { email } });
  }

  async findByResetToken(token) {
    return User.unscoped().findOne({
      where: { resetPasswordToken: token },
    });
  }

  async findAll({ where = {}, offset = 0, limit = 10, order = [['createdAt', 'DESC']] } = {}) {
    return User.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async destroy(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }

  async updateLastLogin(id) {
    return User.update({ lastLogin: new Date() }, { where: { id } });
  }

  async setResetToken(email, token, expiry) {
    return User.update(
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiry,
      },
      { where: { email } }
    );
  }

  async clearResetToken(id) {
    return User.update(
      {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id } }
    );
  }
}

module.exports = new UserRepository();
