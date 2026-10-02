const DashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      let data;
      const role = req.user.role;

      if (role === 'admin' || role === 'hr') {
        data = await DashboardService.getAdminDashboard();
      } else if (role === 'manager') {
        data = await DashboardService.getManagerDashboard(req.user);
      } else {
        data = await DashboardService.getEmployeeDashboard(req.user);
      }

      return sendSuccess(res, 'Dashboard data retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getAdminDashboard(req, res, next) {
    try {
      const data = await DashboardService.getAdminDashboard();
      return sendSuccess(res, 'Admin dashboard retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async getManagerDashboard(req, res, next) {
    try {
      const data = await DashboardService.getManagerDashboard(req.user);
      return sendSuccess(res, 'Manager dashboard retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeDashboard(req, res, next) {
    try {
      const data = await DashboardService.getEmployeeDashboard(req.user);
      return sendSuccess(res, 'Employee dashboard retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
