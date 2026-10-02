const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveRequest = sequelize.define(
  'LeaveRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaveType: {
      type: DataTypes.ENUM(
        'Casual Leave',
        'Sick Leave',
        'Paid Leave',
        'Unpaid Leave',
        'Earned Leave',
        'Maternity Leave',
        'Paternity Leave'
      ),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numberOfDays: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Cancelled'),
      defaultValue: 'Pending',
    },
    reviewedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reviewComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'leave_requests',
    timestamps: true,
    indexes: [
      { fields: ['employeeId'] },
      { fields: ['status'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] },
    ],
  }
);

module.exports = LeaveRequest;
