const { Notification } = require('../models');

class NotificationService {
  async getForUser(userId) {
    return Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 25,
    });
  }

  async getUnreadCount(userId) {
    return Notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(id, userId) {
    const notif = await Notification.findOne({ where: { id, userId } });
    if (notif) {
      await notif.update({ read: true });
    }
    return { success: true };
  }

  async markAllAsRead(userId) {
    await Notification.update({ read: true }, { where: { userId, read: false } });
    return { success: true, message: 'All notifications marked as read' };
  }
}

module.exports = new NotificationService();
