const { Timesheet, Task, Project, Employee, User } = require('../models');
const { Op } = require('sequelize');

class TimesheetService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.workDate) where.workDate = query.workDate;
    if (query.employeeId) where.employeeId = query.employeeId;

    if (user && user.role === 'employee') {
      where.employeeId = user.employeeId || 0;
    } else if (user && user.role === 'manager') {
      const teamEmployees = await Employee.findAll({
        where: { [Op.or]: [{ managerId: user.userId }, { email: user.email }] },
        attributes: ['id'],
      });
      const ids = teamEmployees.map((e) => e.id);
      where.employeeId = { [Op.in]: ids.length > 0 ? ids : [0] };
    }

    return Timesheet.findAll({
      where,
      order: [['workDate', 'DESC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'profileImage'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async create(payload, user) {
    let empId = payload.employeeId;
    if (user && user.role === 'employee') {
      empId = user.employeeId;
    }

    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) throw new Error('Employee record not found');
      empId = emp.id;
    }

    const timesheet = await Timesheet.create({
      ...payload,
      employeeId: empId,
      status: payload.status || 'Draft',
      submittedAt: payload.status === 'Submitted' ? new Date() : null,
    });

    return timesheet;
  }

  async submit(id, user) {
    const record = await Timesheet.findByPk(id);
    if (!record) {
      const error = new Error('Timesheet entry not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'employee' && record.employeeId !== user.employeeId) {
      const error = new Error('Forbidden: You can only submit your own timesheet');
      error.statusCode = 403;
      throw error;
    }

    await record.update({
      status: 'Submitted',
      submittedAt: new Date(),
    });

    return record;
  }

  async review(id, status, reviewComment, user) {
    const record = await Timesheet.findByPk(id);
    if (!record) {
      const error = new Error('Timesheet entry not found');
      error.statusCode = 404;
      throw error;
    }

    await record.update({
      status,
      reviewedById: user.userId,
      reviewComment: reviewComment || null,
    });

    return record;
  }

  async delete(id, user) {
    const record = await Timesheet.findByPk(id);
    if (!record) {
      const error = new Error('Timesheet entry not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'employee' && record.employeeId !== user.employeeId) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    if (record.status === 'Approved') {
      const error = new Error('Cannot delete an already approved timesheet entry');
      error.statusCode = 400;
      throw error;
    }

    await record.destroy();
    return { success: true, message: 'Timesheet entry removed' };
  }
}

module.exports = new TimesheetService();
