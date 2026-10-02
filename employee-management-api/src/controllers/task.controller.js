const TaskService = require('../services/task.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class TaskController {
  async getAll(req, res, next) {
    try {
      const data = await TaskService.getAll(req.query, req.user);
      return sendSuccess(res, 'Tasks retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getKanban(req, res, next) {
    try {
      const data = await TaskService.getKanbanBoard(req.query, req.user);
      return sendSuccess(res, 'Kanban board retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await TaskService.getById(req.params.id);
      return sendSuccess(res, 'Task retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await TaskService.create(req.body, req.user);
      return sendCreated(res, 'Task created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await TaskService.update(req.params.id, req.body, req.user);
      return sendSuccess(res, 'Task updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const data = await TaskService.updateStatus(req.params.id, req.body.status, req.user);
      return sendSuccess(res, 'Task status updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await TaskService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const data = await TaskService.addComment(req.params.id, req.body.comment, req.user);
      return sendCreated(res, 'Comment added successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
