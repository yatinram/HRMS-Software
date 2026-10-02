const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveBalance = sequelize.define(
  'LeaveBalance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    year: {
      type: DataTypes.INTEGER,
      defaultValue: new Date().getFullYear(),
    },
    casualLeave: {
      type: DataTypes.FLOAT,
      defaultValue: 12,
    },
    casualLeaveUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    sickLeave: {
      type: DataTypes.FLOAT,
      defaultValue: 10,
    },
    sickLeaveUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    paidLeave: {
      type: DataTypes.FLOAT,
      defaultValue: 15,
    },
    paidLeaveUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    earnedLeave: {
      type: DataTypes.FLOAT,
      defaultValue: 8,
    },
    earnedLeaveUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: 'leave_balances',
    timestamps: true,
  }
);

module.exports = LeaveBalance;
