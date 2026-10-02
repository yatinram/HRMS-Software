const express = require('express');
const ProjectController = require('../controllers/project.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.post('/', requireRole([ROLES.ADMIN, ROLES.MANAGER]), ProjectController.create);
router.put('/:id', requireRole([ROLES.ADMIN, ROLES.MANAGER]), ProjectController.update);
router.delete('/:id', requireRole([ROLES.ADMIN, ROLES.MANAGER]), ProjectController.delete);

module.exports = router;
