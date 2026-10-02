const express = require('express');
const ExpenseController = require('../controllers/expense.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ExpenseController.getAll);
router.post('/', ExpenseController.create);
router.patch('/:id/approve', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), ExpenseController.approve);
router.patch('/:id/reject', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), ExpenseController.reject);

module.exports = router;
