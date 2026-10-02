const express = require('express');
const EmployeeController = require('../controllers/employee.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/export/csv', requireRole([ROLES.ADMIN, ROLES.HR]), EmployeeController.exportCsv);
router.get('/', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), EmployeeController.create);
router.put('/:id', requireRole([ROLES.ADMIN, ROLES.HR]), EmployeeController.update);
router.patch('/:id/status', requireRole([ROLES.ADMIN, ROLES.HR]), EmployeeController.updateStatus);
router.delete('/:id', requireRole([ROLES.ADMIN]), EmployeeController.delete);

module.exports = router;
