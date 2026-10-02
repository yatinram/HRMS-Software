const RecruitmentService = require('../services/recruitment.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class RecruitmentController {
  async getAll(req, res, next) {
    try {
      const data = await RecruitmentService.getAll(req.query);
      return sendSuccess(res, 'Candidates retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await RecruitmentService.create(req.body);
      return sendCreated(res, 'Candidate registered successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status, notes, interviewDate, interviewerName } = req.body;
      const data = await RecruitmentService.updateStatus(
        req.params.id,
        status,
        notes,
        interviewDate,
        interviewerName
      );
      return sendSuccess(res, 'Candidate status updated', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await RecruitmentService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecruitmentController();
