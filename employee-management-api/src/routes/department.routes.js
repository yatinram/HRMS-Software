const express = require('express');
const DepartmentController = require('../controllers/department.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', DepartmentController.getAll);
router.get('/:id', DepartmentController.getById);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), DepartmentController.create);
router.put('/:id', requireRole([ROLES.ADMIN, ROLES.HR]), DepartmentController.update);
router.delete('/:id', requireRole([ROLES.ADMIN]), DepartmentController.delete);

module.exports = router;
