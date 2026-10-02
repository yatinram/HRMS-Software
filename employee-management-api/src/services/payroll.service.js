const { Payroll, Employee, User } = require('../models');
const { Op } = require('sequelize');

class PayrollService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    if (query.employeeId) where.employeeId = query.employeeId;

    if (user && user.role === 'employee') {
      where.employeeId = user.employeeId || 0;
    }

    return Payroll.findAll({
      where,
      order: [['year', 'DESC'], ['month', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: [
            'id',
            'employeeId',
            'firstName',
            'lastName',
            'email',
            'department',
            'designation',
            'profileImage',
          ],
        },
      ],
    });
  }

  async getMyPayrolls(user) {
    let empId = user.employeeId;
    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) return [];
      empId = emp.id;
    }

    return Payroll.findAll({
      where: { employeeId: empId },
      order: [['year', 'DESC'], ['month', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 'designation'],
        },
      ],
    });
  }

  async getById(id, user) {
    const payroll = await Payroll.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
        },
      ],
    });

    if (!payroll) {
      const error = new Error('Payroll record not found');
      error.statusCode = 404;
      throw error;
    }

    if (user && user.role === 'employee' && payroll.employeeId !== user.employeeId) {
      const error = new Error('Forbidden: You can only view your own salary slip');
      error.statusCode = 403;
      throw error;
    }

    return payroll;
  }

  async generateMonthlyBatch(month, year, user) {
    const employees = await Employee.findAll({ where: { status: 'active' } });
    const created = [];

    for (const emp of employees) {
      const monthlyBase = (emp.salary || 60000) / 12;
      const hra = monthlyBase * 0.2;
      const allowances = monthlyBase * 0.1;
      const bonus = 0;
      const tax = monthlyBase * 0.12;
      const pf = monthlyBase * 0.05;
      const net = monthlyBase + hra + allowances + bonus - tax - pf;

      const [record, wasCreated] = await Payroll.findOrCreate({
        where: { employeeId: emp.id, month, year },
        defaults: {
          employeeId: emp.id,
          month,
          year,
          basicSalary: parseFloat(monthlyBase.toFixed(2)),
          hra: parseFloat(hra.toFixed(2)),
          allowances: parseFloat(allowances.toFixed(2)),
          bonus: 0,
          taxDeduction: parseFloat(tax.toFixed(2)),
          pfDeduction: parseFloat(pf.toFixed(2)),
          otherDeductions: 0,
          netSalary: parseFloat(net.toFixed(2)),
          paymentStatus: 'Pending',
          paymentMethod: 'Direct Bank Transfer',
          notes: `Payroll batch generated for ${month}/${year}`,
        },
      });

      created.push(record);
    }

    return created;
  }

  async updatePaymentStatus(id, paymentStatus, paymentDate, paymentMethod) {
    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      const error = new Error('Payroll record not found');
      error.statusCode = 404;
      throw error;
    }

    await payroll.update({
      paymentStatus,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || payroll.paymentMethod,
    });

    return payroll;
  }
}

module.exports = new PayrollService();
