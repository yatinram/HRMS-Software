const AttendanceService = require('../services/attendance.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class AttendanceController {
  async getTodayStatus(req, res, next) {
    try {
      const data = await AttendanceService.getTodayStatus(req.user);
      return sendSuccess(res, 'Today attendance status retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req, res, next) {
    try {
      const data = await AttendanceService.checkIn(req.user, req.body.notes);
      return sendCreated(res, 'Checked in successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req, res, next) {
    try {
      const data = await AttendanceService.checkOut(req.user, req.body.notes);
      return sendSuccess(res, 'Checked out successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getMyHistory(req, res, next) {
    try {
      const { month, year } = req.query;
      const data = await AttendanceService.getMyHistory(req.user, month, year);
      return sendSuccess(res, 'Attendance history retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await AttendanceService.getAll(req.query, req.user);
      return sendSuccess(res, 'Attendance records retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async requestCorrection(req, res, next) {
    try {
      const data = await AttendanceService.requestCorrection(req.params.id, req.body, req.user);
      return sendSuccess(res, 'Correction request submitted', data);
    } catch (error) {
      next(error);
    }
  }

  async reviewCorrection(req, res, next) {
    try {
      const { status } = req.body;
      const data = await AttendanceService.reviewCorrection(req.params.id, status, req.user);
      return sendSuccess(res, `Correction request ${status.toLowerCase()}`, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
