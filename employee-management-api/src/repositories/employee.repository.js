const { Op } = require('sequelize');
const Employee = require('../models/employee.model');
const Department = require('../models/department.model');

class EmployeeRepository {
  async create(data) {
    return Employee.create(data);
  }

  async findById(id) {
    return Employee.findByPk(id);
  }

  async findAll({ where = {}, offset = 0, limit = 10, order = [['createdAt', 'DESC']] } = {}) {
    return Employee.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
  }

  async update(id, data) {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    return employee.update(data);
  }

  async updateStatus(id, status) {
    return Employee.update({ status }, { where: { id } });
  }

  async destroy(id) {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    await employee.destroy();
    return employee;
  }

  async searchEmployees({ search, department, designation, status, employmentType, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department) where.department = department;
    if (designation) where.designation = designation;
    if (status) where.status = status;
    if (employmentType) where.employmentType = employmentType;

    const offset = (Number(page) - 1) * Number(limit);
    const result = await Employee.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sortBy, sortOrder]],
    });

    return result;
  }

  async getDashboardSummary() {
    const [totalEmployees, activeEmployees, inactiveEmployees, employeesOnLeave, totalDepartments] = await Promise.all([
      Employee.count(),
      Employee.count({ where: { status: 'active' } }),
      Employee.count({ where: { status: 'inactive' } }),
      Employee.count({ where: { status: 'on_leave' } }),
      Department.count(),
    ]);

    const recentEmployees = await Employee.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      employeesOnLeave,
      totalDepartments,
      recentEmployees,
    };
  }

  async getEmployeeStats() {
    const byDepartment = await Employee.findAll({
      attributes: ['department', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['department'],
      raw: true,
    });

    const byStatus = await Employee.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const byEmploymentType = await Employee.findAll({
      attributes: ['employmentType', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['employmentType'],
      raw: true,
    });

    return {
      byDepartment,
      byStatus,
      byEmploymentType,
    };
  }
}

module.exports = new EmployeeRepository();
