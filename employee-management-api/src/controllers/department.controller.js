const DepartmentService = require('../services/department.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class DepartmentController {
  async getAll(req, res, next) {
    try {
      const data = await DepartmentService.getAll();
      return sendSuccess(res, 'Departments retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await DepartmentService.getById(req.params.id);
      return sendSuccess(res, 'Department details retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await DepartmentService.create(req.body);
      return sendCreated(res, 'Department created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await DepartmentService.update(req.params.id, req.body);
      return sendSuccess(res, 'Department updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await DepartmentService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DepartmentController();
