const express = require('express');
const TeamController = require('../controllers/team.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/my-team', requireRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.HR]), TeamController.getMyTeam);
router.get('/projects', requireRole([ROLES.ADMIN, ROLES.MANAGER]), TeamController.getTeamProjects);
router.post('/assign-manager', requireRole([ROLES.ADMIN]), TeamController.assignManager);

module.exports = router;
