const { ExpenseClaim, Employee, User } = require('../models');
const { Op } = require('sequelize');

class ExpenseService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;

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

    return ExpenseClaim.findAll({
      where,
      order: [['claimDate', 'DESC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'profileImage'],
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

    return ExpenseClaim.create({
      ...payload,
      employeeId: empId,
      status: 'Pending',
    });
  }

  async review(id, status, reviewComment, user) {
    const claim = await ExpenseClaim.findByPk(id);
    if (!claim) {
      const error = new Error('Expense claim not found');
      error.statusCode = 404;
      throw error;
    }

    await claim.update({
      status,
      reviewedById: user.userId,
      reviewComment: reviewComment || null,
    });

    return claim;
  }
}

module.exports = new ExpenseService();
