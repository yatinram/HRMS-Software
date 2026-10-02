const { Task, TaskComment, Employee, Project, User } = require('../models');
const { Op } = require('sequelize');

class TaskService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.projectId) where.projectId = query.projectId;
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.assignedEmployeeId) where.assignedEmployeeId = query.assignedEmployeeId;
    if (query.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
      ];
    }

    // Role-based restrictions
    if (user && user.role === 'employee') {
      where.assignedEmployeeId = user.employeeId || 0;
    }

    return Task.findAll({
      where,
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'assignee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'profileImage'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async getKanbanBoard(query = {}, user) {
    const tasks = await this.getAll(query, user);

    const columns = {
      Todo: [],
      'In Progress': [],
      'In Review': [],
      Completed: [],
      'On Hold': [],
    };

    tasks.forEach((t) => {
      const taskJson = t.toJSON();
      if (columns[taskJson.status]) {
        columns[taskJson.status].push(taskJson);
      } else {
        if (!columns['Todo']) columns['Todo'] = [];
        columns['Todo'].push(taskJson);
      }
    });

    return columns;
  }

  async getById(id) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'assignee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'profileImage', 'designation'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'code', 'progress'],
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: TaskComment,
          as: 'comments',
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async create(payload, user) {
    if (!payload.assignedById && user) {
      payload.assignedById = user.userId;
    }

    const task = await Task.create(payload);
    return this.getById(task.id);
  }

  async update(id, payload, user) {
    const task = await Task.findByPk(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Role check: Employee can only update status/actual hours
    if (user && user.role === 'employee') {
      if (task.assignedEmployeeId !== user.employeeId) {
        const error = new Error('Forbidden: You can only update your own assigned tasks');
        error.statusCode = 403;
        throw error;
      }
      await task.update({
        status: payload.status !== undefined ? payload.status : task.status,
        actualHours: payload.actualHours !== undefined ? payload.actualHours : task.actualHours,
      });
      return this.getById(id);
    }

    await task.update(payload);
    return this.getById(id);
  }

  async updateStatus(id, status, user) {
    const task = await Task.findByPk(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (user && user.role === 'employee' && task.assignedEmployeeId !== user.employeeId) {
      const error = new Error('Forbidden: You can only update your own assigned task');
      error.statusCode = 403;
      throw error;
    }

    await task.update({ status });
    return this.getById(id);
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await TaskComment.destroy({ where: { taskId: id } });
    await task.destroy();
    return { success: true, message: 'Task deleted successfully' };
  }

  async addComment(taskId, commentText, user) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const comment = await TaskComment.create({
      taskId,
      userId: user.userId,
      userName: user.email.split('@')[0],
      userRole: user.role,
      comment: commentText,
    });

    return comment;
  }
}

module.exports = new TaskService();
