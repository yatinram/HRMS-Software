const express = require('express');
const DashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', DashboardController.getDashboard);
router.get('/admin', DashboardController.getAdminDashboard);
router.get('/manager', DashboardController.getManagerDashboard);
router.get('/employee', DashboardController.getEmployeeDashboard);

module.exports = router;
