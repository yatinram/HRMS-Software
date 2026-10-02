const { Op } = require('sequelize');
const {
  Employee,
  User,
  Department,
  LeaveBalance,
  Attendance,
  LeaveRequest,
  Task,
  Timesheet,
  Payroll,
} = require('../models');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

class EmployeeService {
  async getAll(query = {}, user) {
    const { page, limit, offset } = parsePagination(query);
    const where = {};

    if (query.search) {
      const search = `%${query.search.trim()}%`;
      where[Op.or] = [
        { firstName: { [Op.like]: search } },
        { lastName: { [Op.like]: search } },
        { email: { [Op.like]: search } },
        { employeeId: { [Op.like]: search } },
        { designation: { [Op.like]: search } },
      ];
    }

    if (query.department) {
      where.department = query.department;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.employmentType) {
      where.employmentType = query.employmentType;
    }

    // Role-based restrictions: Manager sees their own team
    if (user && user.role === 'manager') {
      where[Op.or] = [
        { managerId: user.userId },
        { email: user.email }, // can see own profile
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
      ],
    });

    return {
      employees: rows,
      pagination: buildPaginationMeta(count, page, limit),
    };
  }

  async getById(id, user) {
    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email', 'phone', 'profileImage'],
        },
        {
          model: LeaveBalance,
          as: 'leaveBalance',
        },
      ],
    });

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    // Manager can only access team employees or self
    if (user && user.role === 'manager') {
      if (employee.managerId !== user.userId && employee.email !== user.email) {
        const error = new Error('Forbidden: You can only view employees in your team');
        error.statusCode = 403;
        throw error;
      }
    }

    // Employee can only access self
    if (user && user.role === 'employee') {
      if (employee.email !== user.email && employee.id !== user.employeeId) {
        const error = new Error('Forbidden: You can only view your own profile');
        error.statusCode = 403;
        throw error;
      }
    }

    // Fetch tab data: Attendance history, Leave requests, Assigned tasks, Timesheets, Payrolls
    const [attendances, leaveRequests, tasks, timesheets, payrolls] = await Promise.all([
      Attendance.findAll({
        where: { employeeId: employee.id },
        order: [['date', 'DESC']],
        limit: 15,
      }),
      LeaveRequest.findAll({
        where: { employeeId: employee.id },
        order: [['createdAt', 'DESC']],
        limit: 10,
      }),
      Task.findAll({
        where: { assignedEmployeeId: employee.id },
        order: [['createdAt', 'DESC']],
        limit: 10,
      }),
      Timesheet.findAll({
        where: { employeeId: employee.id },
        order: [['workDate', 'DESC']],
        limit: 10,
      }),
      user && ['admin', 'hr'].includes(user.role)
        ? Payroll.findAll({
            where: { employeeId: employee.id },
            order: [
              ['year', 'DESC'],
              ['month', 'DESC'],
            ],
            limit: 6,
          })
        : [],
    ]);

    return {
      ...employee.toJSON(),
      attendances,
      leaveRequests,
      tasks,
      timesheets,
      payrolls,
    };
  }

  async create(payload, user) {
    const existing = await Employee.findOne({
      where: {
        [Op.or]: [{ email: payload.email }, { employeeId: payload.employeeId }],
      },
    });

    if (existing) {
      const error = new Error('An employee with this Email or Employee ID already exists.');
      error.statusCode = 409;
      throw error;
    }

    const employee = await Employee.create({
      ...payload,
      createdBy: user ? user.userId : null,
    });

    // Create default leave balance
    await LeaveBalance.create({
      employeeId: employee.id,
      year: new Date().getFullYear(),
      casualLeave: 12,
      sickLeave: 10,
      paidLeave: 15,
      earnedLeave: 8,
    });

    return employee;
  }

  async update(id, payload, user) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    await employee.update({
      ...payload,
      updatedBy: user ? user.userId : null,
    });

    return employee;
  }

  async updateStatus(id, status, user) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    await employee.update({
      status,
      updatedBy: user ? user.userId : null,
    });

    return employee;
  }

  async delete(id) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    await employee.destroy();
    return { success: true, message: 'Employee removed successfully' };
  }

  async exportCsv() {
    const employees = await Employee.findAll({
      order: [['employeeId', 'ASC']],
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['name'],
        },
      ],
    });

    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Designation',
      'Employment Type',
      'Salary',
      'Joining Date',
      'Status',
      'Manager',
    ];

    const rows = employees.map((emp) => [
      `"${emp.employeeId}"`,
      `"${emp.firstName}"`,
      `"${emp.lastName}"`,
      `"${emp.email}"`,
      `"${emp.phone || ''}"`,
      `"${emp.department || ''}"`,
      `"${emp.designation || ''}"`,
      `"${emp.employmentType || ''}"`,
      `"${emp.salary || 0}"`,
      `"${emp.joiningDate || ''}"`,
      `"${emp.status || ''}"`,
      `"${emp.manager ? emp.manager.name : ''}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

module.exports = new EmployeeService();
