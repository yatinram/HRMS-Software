const NotificationService = require('../services/notification.service');
const { sendSuccess } = require('../utils/response');

class NotificationController {
  async getMyNotifications(req, res, next) {
    try {
      const data = await NotificationService.getForUser(req.user.userId);
      return sendSuccess(res, 'Notifications retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.userId);
      return sendSuccess(res, 'Unread count retrieved', { unreadCount: count });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const data = await NotificationService.markAsRead(req.params.id, req.user.userId);
      return sendSuccess(res, 'Notification marked as read', data);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const data = await NotificationService.markAllAsRead(req.user.userId);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
