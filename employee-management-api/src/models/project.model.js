const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teamMemberIds: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'),
      defaultValue: 'Planning',
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      defaultValue: 'Medium',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
  }
);

module.exports = Project;
