const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assignedEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assignedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.ENUM('Todo', 'In Progress', 'In Review', 'Completed', 'On Hold', 'Cancelled'),
      defaultValue: 'Todo',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    actualHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      { fields: ['projectId'] },
      { fields: ['assignedEmployeeId'] },
      { fields: ['status'] },
      { fields: ['priority'] },
    ],
  }
);

module.exports = Task;
