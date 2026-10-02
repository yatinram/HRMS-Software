const express = require('express');
const SettingsController = require('../controllers/settings.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/company', SettingsController.getCompanySettings);
router.put('/company', requireRole([ROLES.ADMIN]), SettingsController.updateCompanySettings);
router.get('/audit-logs', requireRole([ROLES.ADMIN]), SettingsController.getAuditLogs);

module.exports = router;
