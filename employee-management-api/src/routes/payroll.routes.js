const express = require('express');
const PayrollController = require('../controllers/payroll.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', PayrollController.getMyPayrolls);
router.get('/', requireRole([ROLES.ADMIN, ROLES.HR]), PayrollController.getAll);
router.get('/:id', PayrollController.getById);
router.post('/generate-batch', requireRole([ROLES.ADMIN, ROLES.HR]), PayrollController.generateBatch);
router.patch('/:id/status', requireRole([ROLES.ADMIN, ROLES.HR]), PayrollController.updateStatus);

module.exports = router;
