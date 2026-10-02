const User = require('./user.model');
const Employee = require('./employee.model');
const Department = require('./department.model');
const Designation = require('./designation.model');
const Project = require('./project.model');
const Task = require('./task.model');
const TaskComment = require('./taskComment.model');
const LeaveRequest = require('./leaveRequest.model');
const LeaveBalance = require('./leaveBalance.model');
const Attendance = require('./attendance.model');
const Timesheet = require('./timesheet.model');
const Payroll = require('./payroll.model');
const Notification = require('./notification.model');
const Announcement = require('./announcement.model');
const Candidate = require('./candidate.model');
const Onboarding = require('./onboarding.model');
const ExpenseClaim = require('./expenseClaim.model');
const AuditLog = require('./auditLog.model');
const CompanySettings = require('./companySettings.model');

// User & Employee
User.hasMany(Employee, { foreignKey: 'managerId', as: 'managedEmployees' });
Employee.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// Department & User
Department.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
Employee.belongsTo(Department, { foreignKey: 'department', targetKey: 'name', as: 'departmentInfo' });

// Designation & Department
Designation.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Designation, { foreignKey: 'departmentId', as: 'designations' });

// Project & User (Manager)
Project.belongsTo(User, { foreignKey: 'projectManagerId', as: 'projectManager' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });

// Task & Associations
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(Employee, { foreignKey: 'assignedEmployeeId', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'assignedById', as: 'assignedBy' });
Task.hasMany(TaskComment, { foreignKey: 'taskId', as: 'comments' });
TaskComment.belongsTo(Task, { foreignKey: 'taskId' });

// LeaveRequest & Employee
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
LeaveRequest.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewer' });

// LeaveBalance & Employee
LeaveBalance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasOne(LeaveBalance, { foreignKey: 'employeeId', as: 'leaveBalance' });

// Attendance & Employee
Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances' });

// Timesheet & Associations
Timesheet.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Timesheet.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Timesheet.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Timesheet.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewer' });

// Payroll & Employee
Payroll.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Payroll, { foreignKey: 'employeeId', as: 'payrolls' });

// Notifications & User
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// ExpenseClaim & Employee
ExpenseClaim.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
ExpenseClaim.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewer' });

module.exports = {
  User,
  Employee,
  Department,
  Designation,
  Project,
  Task,
  TaskComment,
  LeaveRequest,
  LeaveBalance,
  Attendance,
  Timesheet,
  Payroll,
  Notification,
  Announcement,
  Candidate,
  Onboarding,
  ExpenseClaim,
  AuditLog,
  CompanySettings,
};
