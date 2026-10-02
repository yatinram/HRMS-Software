const OnboardingService = require('../services/onboarding.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class OnboardingController {
  async getAll(req, res, next) {
    try {
      const data = await OnboardingService.getAll(req.query);
      return sendSuccess(res, 'Onboarding records retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await OnboardingService.create(req.body);
      return sendCreated(res, 'Onboarding record created', data);
    } catch (error) {
      next(error);
    }
  }

  async toggleTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const data = await OnboardingService.toggleTask(req.params.id, taskId);
      return sendSuccess(res, 'Task state updated', data);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const data = await OnboardingService.updateStatus(req.params.id, status, notes);
      return sendSuccess(res, 'Onboarding status updated', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OnboardingController();
