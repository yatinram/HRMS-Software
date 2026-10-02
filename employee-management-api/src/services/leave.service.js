const { LeaveRequest, LeaveBalance, Employee, User } = require('../models');
const { Op } = require('sequelize');

class LeaveService {
  async getAll(query = {}, user) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.leaveType) where.leaveType = query.leaveType;
    if (query.employeeId) where.employeeId = query.employeeId;

    // Role-based visibility
    if (user && user.role === 'employee') {
      where.employeeId = user.employeeId || 0;
    } else if (user && user.role === 'manager') {
      // Find team member IDs
      const teamEmployees = await Employee.findAll({
        where: { [Op.or]: [{ managerId: user.userId }, { email: user.email }] },
        attributes: ['id'],
      });
      const ids = teamEmployees.map((e) => e.id);
      where.employeeId = { [Op.in]: ids.length > 0 ? ids : [0] };
    }

    return LeaveRequest.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 'designation', 'profileImage'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async getMyLeaves(user) {
    if (!user.employeeId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) return { requests: [], balance: null };
      user.employeeId = emp.id;
    }

    const [requests, balance] = await Promise.all([
      LeaveRequest.findAll({
        where: { employeeId: user.employeeId },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'reviewer', attributes: ['id', 'name'] }],
      }),
      LeaveBalance.findOne({ where: { employeeId: user.employeeId } }),
    ]);

    return { requests, balance };
  }

  async apply(payload, user) {
    let empId = payload.employeeId;
    if (user && user.role === 'employee') {
      empId = user.employeeId;
    }

    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) throw new Error('Employee record not found for this user account');
      empId = emp.id;
    }

    // Check overlapping requests
    const overlapping = await LeaveRequest.findOne({
      where: {
        employeeId: empId,
        status: { [Op.in]: ['Pending', 'Approved'] },
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [payload.startDate, payload.endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [payload.startDate, payload.endDate],
            },
          },
        ],
      },
    });

    if (overlapping) {
      const error = new Error('You already have a pending or approved leave request during this date range.');
      error.statusCode = 400;
      throw error;
    }

    // Validate days
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const numberOfDays = payload.numberOfDays || diffDays;

    const request = await LeaveRequest.create({
      employeeId: empId,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      numberOfDays,
      reason: payload.reason,
      attachment: payload.attachment || null,
      status: 'Pending',
    });

    return request;
  }

  async review(id, status, reviewComment, user) {
    const request = await LeaveRequest.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!request) {
      const error = new Error('Leave request not found');
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== 'Pending') {
      const error = new Error(`Leave request has already been ${request.status}`);
      error.statusCode = 400;
      throw error;
    }

    await request.update({
      status,
      reviewedById: user.userId,
      reviewComment: reviewComment || null,
    });

    // If approved, update Leave Balance
    if (status === 'Approved') {
      const balance = await LeaveBalance.findOne({ where: { employeeId: request.employeeId } });
      if (balance) {
        if (request.leaveType === 'Casual Leave') {
          await balance.update({ casualLeaveUsed: balance.casualLeaveUsed + request.numberOfDays });
        } else if (request.leaveType === 'Sick Leave') {
          await balance.update({ sickLeaveUsed: balance.sickLeaveUsed + request.numberOfDays });
        } else if (request.leaveType === 'Paid Leave') {
          await balance.update({ paidLeaveUsed: balance.paidLeaveUsed + request.numberOfDays });
        } else if (request.leaveType === 'Earned Leave') {
          await balance.update({ earnedLeaveUsed: balance.earnedLeaveUsed + request.numberOfDays });
        }
      }
    }

    return request;
  }

  async cancel(id, user) {
    const request = await LeaveRequest.findByPk(id);
    if (!request) {
      const error = new Error('Leave request not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'employee' && request.employeeId !== user.employeeId) {
      const error = new Error('Forbidden: You can only cancel your own leave requests');
      error.statusCode = 403;
      throw error;
    }

    if (request.status !== 'Pending') {
      const error = new Error('Only Pending leave requests can be cancelled directly.');
      error.statusCode = 400;
      throw error;
    }

    await request.update({ status: 'Cancelled' });
    return { success: true, message: 'Leave request cancelled' };
  }

  async getBalances(employeeId) {
    return LeaveBalance.findOne({ where: { employeeId } });
  }
}

module.exports = new LeaveService();
