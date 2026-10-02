const express = require('express');
const TimesheetController = require('../controllers/timesheet.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', TimesheetController.getAll);
router.post('/', TimesheetController.create);
router.patch('/:id/submit', TimesheetController.submit);
router.patch('/:id/approve', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), TimesheetController.approve);
router.patch('/:id/reject', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), TimesheetController.reject);
router.delete('/:id', TimesheetController.delete);

module.exports = router;
