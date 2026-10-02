const { Announcement } = require('../models');

class AnnouncementService {
  async getAll() {
    return Announcement.findAll({
      where: { isActive: true },
      order: [['publishedAt', 'DESC']],
    });
  }

  async create(payload, user) {
    return Announcement.create({
      ...payload,
      authorId: user ? user.userId : null,
      authorName: user ? user.email.split('@')[0] : 'Admin',
    });
  }

  async delete(id) {
    const item = await Announcement.findByPk(id);
    if (!item) {
      const error = new Error('Announcement not found');
      error.statusCode = 404;
      throw error;
    }

    await item.destroy();
    return { success: true, message: 'Announcement deleted' };
  }
}

module.exports = new AnnouncementService();
