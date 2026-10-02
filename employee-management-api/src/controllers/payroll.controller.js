const PayrollService = require('../services/payroll.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class PayrollController {
  async getAll(req, res, next) {
    try {
      const data = await PayrollService.getAll(req.query, req.user);
      return sendSuccess(res, 'Payrolls retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getMyPayrolls(req, res, next) {
    try {
      const data = await PayrollService.getMyPayrolls(req.user);
      return sendSuccess(res, 'My salary records retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await PayrollService.getById(req.params.id, req.user);
      return sendSuccess(res, 'Salary slip details retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async generateBatch(req, res, next) {
    try {
      const { month, year } = req.body;
      const data = await PayrollService.generateMonthlyBatch(
        Number(month),
        Number(year),
        req.user
      );
      return sendCreated(res, 'Monthly payroll batch generated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { paymentStatus, paymentDate, paymentMethod } = req.body;
      const data = await PayrollService.updatePaymentStatus(
        req.params.id,
        paymentStatus,
        paymentDate,
        paymentMethod
      );
      return sendSuccess(res, 'Payroll status updated', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PayrollController();
