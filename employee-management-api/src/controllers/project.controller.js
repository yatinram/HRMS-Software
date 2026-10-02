const ProjectService = require('../services/project.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class ProjectController {
  async getAll(req, res, next) {
    try {
      const data = await ProjectService.getAll(req.query, req.user);
      return sendSuccess(res, 'Projects retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await ProjectService.getById(req.params.id);
      return sendSuccess(res, 'Project details retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await ProjectService.create(req.body, req.user);
      return sendCreated(res, 'Project created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await ProjectService.update(req.params.id, req.body);
      return sendSuccess(res, 'Project updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await ProjectService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
