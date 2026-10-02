const { Op } = require('sequelize');
const { Employee, User, Task, LeaveRequest, Attendance, Timesheet, Project } = require('../models');

class TeamService {
  async getMyTeam(user) {
    const managerId = user.role === 'admin' ? null : user.userId;
    const where = {};
    if (managerId) {
      where.managerId = managerId;
    }

    const members = await Employee.findAll({
      where,
      order: [['firstName', 'ASC']],
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const memberIds = members.map((m) => m.id);
    const todayStr = new Date().toISOString().split('T')[0];

    const [todayAttendance, pendingLeaves, activeTasks, submittedTimesheets] = await Promise.all([
      Attendance.findAll({
        where: {
          employeeId: { [Op.in]: memberIds.length > 0 ? memberIds : [0] },
          date: todayStr,
        },
      }),
      LeaveRequest.findAll({
        where: {
          employeeId: { [Op.in]: memberIds.length > 0 ? memberIds : [0] },
          status: 'Pending',
        },
        include: [{ model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'] }],
      }),
      Task.findAll({
        where: {
          assignedEmployeeId: { [Op.in]: memberIds.length > 0 ? memberIds : [0] },
          status: { [Op.ne]: 'Completed' },
        },
      }),
      Timesheet.findAll({
        where: {
          employeeId: { [Op.in]: memberIds.length > 0 ? memberIds : [0] },
          status: 'Submitted',
        },
        include: [{ model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      }),
    ]);

    return {
      members,
      stats: {
        totalMembers: members.length,
        presentToday: todayAttendance.filter((a) => ['Present', 'Late'].includes(a.status)).length,
        absentToday: members.length - todayAttendance.length,
        pendingLeavesCount: pendingLeaves.length,
        activeTasksCount: activeTasks.length,
        pendingTimesheetsCount: submittedTimesheets.length,
      },
      todayAttendance,
      pendingLeaves,
      submittedTimesheets,
    };
  }

  async getTeamProjects(user) {
    const where = {};
    if (user.role === 'manager') {
      where.projectManagerId = user.userId;
    }

    return Project.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [{ model: Task, as: 'tasks' }],
    });
  }

  async assignManager(employeeId, managerId) {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    const manager = await User.findByPk(managerId);
    if (!manager || !['manager', 'admin'].includes(manager.role)) {
      const error = new Error('Selected user must be an active Manager or Admin');
      error.statusCode = 400;
      throw error;
    }

    await employee.update({ managerId });
    return employee;
  }
}

module.exports = new TeamService();
