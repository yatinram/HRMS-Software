const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', NotificationController.getMyNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/mark-all-read', NotificationController.markAllAsRead);

module.exports = router;
