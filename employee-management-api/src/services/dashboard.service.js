const { Op, fn, col, literal } = require('sequelize');
const {
  Employee,
  User,
  Department,
  Attendance,
  LeaveRequest,
  Task,
  Project,
  Timesheet,
  Payroll,
  Announcement,
  CompanySettings,
} = require('../models');

class DashboardService {
  async getAdminDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalEmployees,
      activeEmployees,
      totalManagers,
      totalHR,
      presentToday,
      absentToday,
      pendingLeaves,
      activeProjects,
      pendingTasks,
      departments,
      recentEmployees,
      pendingLeaveRequests,
      todayAttendance,
      announcements,
      settings,
    ] = await Promise.all([
      Employee.count(),
      Employee.count({ where: { status: 'active' } }),
      User.count({ where: { role: 'manager' } }),
      User.count({ where: { role: 'hr' } }),
      Attendance.count({ where: { date: todayStr, status: { [Op.in]: ['Present', 'Late'] } } }),
      Employee.count({ where: { status: 'active' } }).then(async (total) => {
        const present = await Attendance.count({
          where: { date: todayStr, status: { [Op.in]: ['Present', 'Late'] } },
        });
        return Math.max(0, total - present);
      }),
      LeaveRequest.count({ where: { status: 'Pending' } }),
      Project.count({ where: { status: 'Active' } }),
      Task.count({ where: { status: { [Op.notIn]: ['Completed', 'Cancelled'] } } }),
      Department.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'code'],
      }),
      Employee.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 'designation', 'profileImage', 'joiningDate', 'status'],
      }),
      LeaveRequest.findAll({
        where: { status: 'Pending' },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'profileImage'],
          },
        ],
      }),
      Attendance.findAll({
        where: { date: todayStr },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id', 'employeeId', 'firstName', 'lastName', 'profileImage', 'department'],
          },
        ],
      }),
      Announcement.findAll({
        where: { isActive: true },
        order: [['publishedAt', 'DESC']],
        limit: 3,
      }),
      CompanySettings.findOne(),
    ]);

    // Department distribution for chart
    const deptDistribution = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.count({ where: { department: dept.name, status: 'active' } });
        return { name: dept.name, count };
      })
    );

    // Task status distribution for chart
    const taskStatuses = ['Todo', 'In Progress', 'In Review', 'Completed', 'On Hold'];
    const taskDistribution = await Promise.all(
      taskStatuses.map(async (status) => {
        const count = await Task.count({ where: { status } });
        return { status, count };
      })
    );

    // Leave status distribution
    const leaveStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
    const leaveDistribution = await Promise.all(
      leaveStatuses.map(async (status) => {
        const count = await LeaveRequest.count({ where: { status } });
        return { status, count };
      })
    );

    // Attendance this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const present = await Attendance.count({
        where: { date: dateStr, status: { [Op.in]: ['Present', 'Late'] } },
      });
      const absent = await Attendance.count({
        where: { date: dateStr, status: 'Absent' },
      });
      weekDays.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        present,
        absent,
      });
    }

    const holidays = settings ? settings.holidays || [] : [];

    return {
      stats: {
        totalEmployees,
        activeEmployees,
        totalManagers,
        totalHR,
        presentToday,
        absentToday,
        pendingLeaves,
        activeProjects,
        pendingTasks,
      },
      charts: {
        departmentDistribution: deptDistribution,
        taskDistribution,
        leaveDistribution,
        weeklyAttendance: weekDays,
      },
      recentEmployees,
      pendingLeaveRequests,
      todayAttendance,
      announcements,
      upcomingHolidays: holidays.filter((h) => new Date(h.date) >= new Date()).slice(0, 5),
    };
  }

  async getManagerDashboard(user) {
    const todayStr = new Date().toISOString().split('T')[0];

    const teamEmployees = await Employee.findAll({
      where: { managerId: user.userId, status: 'active' },
      attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 'designation', 'profileImage'],
    });

    const memberIds = teamEmployees.map((e) => e.id);
    const safeIds = memberIds.length > 0 ? memberIds : [0];

    const [teamPresent, teamTasks, pendingLeaves, pendingTimesheets, announcements] =
      await Promise.all([
        Attendance.findAll({
          where: {
            employeeId: { [Op.in]: safeIds },
            date: todayStr,
          },
          include: [
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'firstName', 'lastName', 'profileImage'],
            },
          ],
        }),
        Task.findAll({
          where: {
            assignedEmployeeId: { [Op.in]: safeIds },
            status: { [Op.notIn]: ['Completed', 'Cancelled'] },
          },
          include: [
            {
              model: Employee,
              as: 'assignee',
              attributes: ['id', 'firstName', 'lastName', 'profileImage'],
            },
          ],
          limit: 10,
        }),
        LeaveRequest.findAll({
          where: {
            employeeId: { [Op.in]: safeIds },
            status: 'Pending',
          },
          include: [
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
            },
          ],
        }),
        Timesheet.findAll({
          where: {
            employeeId: { [Op.in]: safeIds },
            status: 'Submitted',
          },
          include: [
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        }),
        Announcement.findAll({
          where: { isActive: true },
          order: [['publishedAt', 'DESC']],
          limit: 3,
        }),
      ]);

    return {
      stats: {
        totalTeamMembers: teamEmployees.length,
        presentToday: teamPresent.filter((a) => ['Present', 'Late'].includes(a.status)).length,
        absentToday: teamEmployees.length - teamPresent.length,
        pendingLeaves: pendingLeaves.length,
        activeTasks: teamTasks.length,
        pendingTimesheets: pendingTimesheets.length,
      },
      teamMembers: teamEmployees,
      todayAttendance: teamPresent,
      activeTasks: teamTasks,
      pendingLeaveRequests: pendingLeaves,
      pendingTimesheetReviews: pendingTimesheets,
      announcements,
    };
  }

  async getEmployeeDashboard(user) {
    const todayStr = new Date().toISOString().split('T')[0];
    let empId = user.employeeId;

    if (!empId) {
      const emp = await Employee.findOne({ where: { email: user.email } });
      if (emp) empId = emp.id;
    }

    const safeEmpId = empId || 0;

    const [todayAttendance, myTasks, leaveBalance, recentLeaves, recentTimesheets, announcements] =
      await Promise.all([
        Attendance.findOne({
          where: { employeeId: safeEmpId, date: todayStr },
        }),
        Task.findAll({
          where: {
            assignedEmployeeId: safeEmpId,
            status: { [Op.notIn]: ['Completed', 'Cancelled'] },
          },
          order: [['dueDate', 'ASC']],
          limit: 8,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'name', 'code'],
            },
          ],
        }),
        require('../models/leaveBalance.model').findOne({
          where: { employeeId: safeEmpId },
        }),
        LeaveRequest.findAll({
          where: { employeeId: safeEmpId },
          order: [['createdAt', 'DESC']],
          limit: 5,
        }),
        Timesheet.findAll({
          where: { employeeId: safeEmpId },
          order: [['workDate', 'DESC']],
          limit: 5,
        }),
        Announcement.findAll({
          where: { isActive: true },
          order: [['publishedAt', 'DESC']],
          limit: 3,
        }),
      ]);

    const totalTasks = await Task.count({ where: { assignedEmployeeId: safeEmpId } });
    const completedTasks = await Task.count({
      where: { assignedEmployeeId: safeEmpId, status: 'Completed' },
    });

    return {
      stats: {
        checkedIn: !!(todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime),
        checkedOut: !!(todayAttendance && todayAttendance.checkOutTime),
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        totalLeaveBalance: leaveBalance
          ? (leaveBalance.casualLeave - leaveBalance.casualLeaveUsed) +
            (leaveBalance.sickLeave - leaveBalance.sickLeaveUsed) +
            (leaveBalance.paidLeave - leaveBalance.paidLeaveUsed) +
            (leaveBalance.earnedLeave - leaveBalance.earnedLeaveUsed)
          : 0,
      },
      todayAttendance,
      activeTasks: myTasks,
      leaveBalance,
      recentLeaves,
      recentTimesheets,
      announcements,
    };
  }
}

module.exports = new DashboardService();
