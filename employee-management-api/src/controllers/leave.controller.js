const LeaveService = require('../services/leave.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class LeaveController {
  async getAll(req, res, next) {
    try {
      const data = await LeaveService.getAll(req.query, req.user);
      return sendSuccess(res, 'Leave requests retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getMyLeaves(req, res, next) {
    try {
      const data = await LeaveService.getMyLeaves(req.user);
      return sendSuccess(res, 'My leaves retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async apply(req, res, next) {
    try {
      const data = await LeaveService.apply(req.body, req.user);
      return sendCreated(res, 'Leave request submitted successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await LeaveService.review(req.params.id, 'Approved', reviewComment, req.user);
      return sendSuccess(res, 'Leave request approved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await LeaveService.review(req.params.id, 'Rejected', reviewComment, req.user);
      return sendSuccess(res, 'Leave request rejected', data);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const data = await LeaveService.cancel(req.params.id, req.user);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }

  async getBalances(req, res, next) {
    try {
      const empId = req.params.employeeId || req.user.employeeId;
      const data = await LeaveService.getBalances(empId);
      return sendSuccess(res, 'Leave balances retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaveController();
