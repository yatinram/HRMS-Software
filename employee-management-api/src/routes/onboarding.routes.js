const express = require('express');
const OnboardingController = require('../controllers/onboarding.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireRole([ROLES.ADMIN, ROLES.HR]), OnboardingController.getAll);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), OnboardingController.create);
router.patch('/:id/tasks/:taskId/toggle', requireRole([ROLES.ADMIN, ROLES.HR]), OnboardingController.toggleTask);
router.patch('/:id/status', requireRole([ROLES.ADMIN, ROLES.HR]), OnboardingController.updateStatus);

module.exports = router;
