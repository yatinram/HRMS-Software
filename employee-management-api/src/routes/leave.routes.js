const express = require('express');
const LeaveController = require('../controllers/leave.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/my-leaves', LeaveController.getMyLeaves);
router.get('/balance/:employeeId?', LeaveController.getBalances);
router.get('/', LeaveController.getAll);
router.post('/apply', LeaveController.apply);
router.patch('/:id/approve', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), LeaveController.approve);
router.patch('/:id/reject', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), LeaveController.reject);
router.patch('/:id/cancel', LeaveController.cancel);

module.exports = router;
