const express = require('express');
const TaskController = require('../controllers/task.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/kanban', TaskController.getKanban);
router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', requireRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.HR]), TaskController.create);
router.put('/:id', TaskController.update);
router.patch('/:id/status', TaskController.updateStatus);
router.post('/:id/comments', TaskController.addComment);
router.delete('/:id', requireRole([ROLES.ADMIN, ROLES.MANAGER]), TaskController.delete);

module.exports = router;
