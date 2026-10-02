const { Project, Task, User, Employee } = require('../models');
const { Op } = require('sequelize');

class ProjectService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { code: { [Op.like]: `%${query.search}%` } },
      ];
    }

    if (user && user.role === 'manager') {
      where.projectManagerId = user.userId;
    }

    const projects = await Project.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'title', 'status', 'priority'],
        },
      ],
    });

    // Populate team member profiles
    const results = await Promise.all(
      projects.map(async (p) => {
        let members = [];
        if (p.teamMemberIds && p.teamMemberIds.length > 0) {
          members = await Employee.findAll({
            where: { id: { [Op.in]: p.teamMemberIds } },
            attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'designation', 'profileImage'],
          });
        }
        return {
          ...p.toJSON(),
          teamMembers: members,
          totalTasks: p.tasks ? p.tasks.length : 0,
          completedTasks: p.tasks ? p.tasks.filter((t) => t.status === 'Completed').length : 0,
        };
      })
    );

    return results;
  }

  async getById(id) {
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'name', 'email', 'phone', 'profileImage'],
        },
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: Employee,
              as: 'assignee',
              attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
            },
          ],
        },
      ],
    });

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    let teamMembers = [];
    if (project.teamMemberIds && project.teamMemberIds.length > 0) {
      teamMembers = await Employee.findAll({
        where: { id: { [Op.in]: project.teamMemberIds } },
        attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'designation', 'profileImage'],
      });
    }

    return {
      ...project.toJSON(),
      teamMembers,
    };
  }

  async create(payload, user) {
    const existing = await Project.findOne({ where: { code: payload.code } });
    if (existing) {
      const error = new Error('A project with this project code already exists.');
      error.statusCode = 409;
      throw error;
    }

    if (!payload.projectManagerId && user) {
      payload.projectManagerId = user.userId;
    }

    return Project.create(payload);
  }

  async update(id, payload) {
    const project = await Project.findByPk(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    await project.update(payload);
    return project;
  }

  async delete(id) {
    const project = await Project.findByPk(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    await Task.destroy({ where: { projectId: id } });
    await project.destroy();
    return { success: true, message: 'Project removed successfully' };
  }
}

module.exports = new ProjectService();
