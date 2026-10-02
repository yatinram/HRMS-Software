const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Onboarding = sequelize.define(
  'Onboarding',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    candidateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    candidateEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      defaultValue: 'Pending',
    },
    tasks: {
      type: DataTypes.JSON,
      defaultValue: [
        { id: 1, title: 'Submit Identification & Tax Documents', completed: false },
        { id: 2, title: 'Signed Employment Contract', completed: false },
        { id: 3, title: 'Setup Company Email & Slack Account', completed: false },
        { id: 4, title: 'Hardware & Workstation Provisioning', completed: false },
        { id: 5, title: 'HR Policy & Benefits Orientation', completed: false },
        { id: 6, title: 'Team Introduction & Manager 1-on-1', completed: false },
      ],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'onboardings',
    timestamps: true,
  }
);

module.exports = Onboarding;
