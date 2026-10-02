const express = require('express');
const AttendanceController = require('../controllers/attendance.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/today', AttendanceController.getTodayStatus);
router.post('/check-in', AttendanceController.checkIn);
router.post('/check-out', AttendanceController.checkOut);
router.get('/my-history', AttendanceController.getMyHistory);
router.get('/', AttendanceController.getAll);
router.post('/:id/correction', AttendanceController.requestCorrection);
router.patch('/:id/correction', requireRole([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]), AttendanceController.reviewCorrection);

module.exports = router;
