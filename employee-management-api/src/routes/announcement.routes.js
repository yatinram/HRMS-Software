const express = require('express');
const AnnouncementController = require('../controllers/announcement.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', AnnouncementController.getAll);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), AnnouncementController.create);
router.delete('/:id', requireRole([ROLES.ADMIN, ROLES.HR]), AnnouncementController.delete);

module.exports = router;
