const TimesheetService = require('../services/timesheet.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class TimesheetController {
  async getAll(req, res, next) {
    try {
      const data = await TimesheetService.getAll(req.query, req.user);
      return sendSuccess(res, 'Timesheets retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await TimesheetService.create(req.body, req.user);
      return sendCreated(res, 'Timesheet entry created', data);
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const data = await TimesheetService.submit(req.params.id, req.user);
      return sendSuccess(res, 'Timesheet submitted for approval', data);
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await TimesheetService.review(req.params.id, 'Approved', reviewComment, req.user);
      return sendSuccess(res, 'Timesheet approved', data);
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await TimesheetService.review(req.params.id, 'Rejected', reviewComment, req.user);
      return sendSuccess(res, 'Timesheet rejected', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await TimesheetService.delete(req.params.id, req.user);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TimesheetController();
