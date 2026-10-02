const DesignationService = require('../services/designation.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class DesignationController {
  async getAll(req, res, next) {
    try {
      const data = await DesignationService.getAll(req.query);
      return sendSuccess(res, 'Designations retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await DesignationService.create(req.body);
      return sendCreated(res, 'Designation created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await DesignationService.update(req.params.id, req.body);
      return sendSuccess(res, 'Designation updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await DesignationService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DesignationController();
