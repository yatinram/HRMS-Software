const { Attendance, Employee, User } = require('../models');
const { Op } = require('sequelize');

class AttendanceService {
  async getTodayStatus(user) {
    let empId = user.employeeId;
    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) return { checkedIn: false, record: null };
      empId = emp.id;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({
      where: { employeeId: empId, date: todayStr },
    });

    return {
      date: todayStr,
      checkedIn: !!(record && record.checkInTime && !record.checkOutTime),
      checkedOut: !!(record && record.checkOutTime),
      record,
    };
  }

  async checkIn(user, notes = '') {
    let empId = user.employeeId;
    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) throw new Error('Employee profile not found');
      empId = emp.id;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    const existing = await Attendance.findOne({
      where: { employeeId: empId, date: todayStr },
    });

    if (existing && existing.checkInTime) {
      const error = new Error('You have already checked in for today.');
      error.statusCode = 400;
      throw error;
    }

    // Determine if late (e.g. after 9:15 AM)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isLate = hours > 9 || (hours === 9 && minutes > 15);
    const status = isLate ? 'Late' : 'Present';

    let record;
    if (existing) {
      record = await existing.update({
        checkInTime: now,
        status,
        notes: notes || existing.notes,
      });
    } else {
      record = await Attendance.create({
        employeeId: empId,
        date: todayStr,
        checkInTime: now,
        status,
        notes,
      });
    }

    return record;
  }

  async checkOut(user, notes = '') {
    let empId = user.employeeId;
    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) throw new Error('Employee profile not found');
      empId = emp.id;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    const existing = await Attendance.findOne({
      where: { employeeId: empId, date: todayStr },
    });

    if (!existing || !existing.checkInTime) {
      const error = new Error('Cannot check out without checking in first.');
      error.statusCode = 400;
      throw error;
    }

    if (existing.checkOutTime) {
      const error = new Error('You have already checked out for today.');
      error.statusCode = 400;
      throw error;
    }

    // Calculate total hours
    const checkInMs = new Date(existing.checkInTime).getTime();
    const checkOutMs = now.getTime();
    const diffHours = Math.max(0, ((checkOutMs - checkInMs) / (1000 * 60 * 60)) - (existing.breakDurationMinutes / 60));

    await existing.update({
      checkOutTime: now,
      totalWorkingHours: parseFloat(diffHours.toFixed(2)),
      notes: notes ? (existing.notes ? `${existing.notes} | ${notes}` : notes) : existing.notes,
    });

    return existing;
  }

  async getMyHistory(user, month, year) {
    let empId = user.employeeId;
    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (!emp) return [];
      empId = emp.id;
    }

    const where = { employeeId: empId };
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
      where.date = { [Op.between]: [startDate, endDate] };
    }

    return Attendance.findAll({
      where,
      order: [['date', 'DESC']],
    });
  }

  async getAll(query = {}, user) {
    const where = {};
    if (query.date) where.date = query.date;
    if (query.status) where.status = query.status;
    if (query.employeeId) where.employeeId = query.employeeId;

    if (user && user.role === 'manager') {
      const teamEmployees = await Employee.findAll({
        where: { [Op.or]: [{ managerId: user.userId }, { email: user.email }] },
        attributes: ['id'],
      });
      const ids = teamEmployees.map((e) => e.id);
      where.employeeId = { [Op.in]: ids.length > 0 ? ids : [0] };
    }

    return Attendance.findAll({
      where,
      order: [['date', 'DESC'], ['checkInTime', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 'designation', 'profileImage'],
        },
      ],
    });
  }

  async requestCorrection(id, payload, user) {
    const record = await Attendance.findByPk(id);
    if (!record) {
      const error = new Error('Attendance record not found');
      error.statusCode = 404;
      throw error;
    }

    await record.update({
      correctionRequestStatus: 'Pending',
      correctionReason: payload.reason,
      requestedCheckIn: payload.requestedCheckIn,
      requestedCheckOut: payload.requestedCheckOut,
    });

    return record;
  }

  async reviewCorrection(id, status, user) {
    const record = await Attendance.findByPk(id);
    if (!record) {
      const error = new Error('Attendance record not found');
      error.statusCode = 404;
      throw error;
    }

    if (status === 'Approved' && record.requestedCheckIn) {
      let totalHours = record.totalWorkingHours;
      if (record.requestedCheckIn && record.requestedCheckOut) {
        const diff = (new Date(record.requestedCheckOut) - new Date(record.requestedCheckIn)) / (1000 * 60 * 60);
        totalHours = Math.max(0, parseFloat(diff.toFixed(2)));
      }

      await record.update({
        checkInTime: record.requestedCheckIn,
        checkOutTime: record.requestedCheckOut || record.checkOutTime,
        totalWorkingHours: totalHours,
        correctionRequestStatus: 'Approved',
        status: 'Present',
      });
    } else {
      await record.update({
        correctionRequestStatus: status,
      });
    }

    return record;
  }
}

module.exports = new AttendanceService();
