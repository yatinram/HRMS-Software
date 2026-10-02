const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Timesheet = sequelize.define(
  'Timesheet',
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
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    workDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0.5,
        max: 24,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Submitted', 'Approved', 'Rejected'),
      defaultValue: 'Draft',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'timesheets',
    timestamps: true,
    indexes: [
      { fields: ['employeeId'] },
      { fields: ['workDate'] },
      { fields: ['status'] },
      { fields: ['projectId'] },
    ],
  }
);

module.exports = Timesheet;
