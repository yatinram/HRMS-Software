const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candidate = sequelize.define(
  'Candidate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appliedPosition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experienceYears: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'),
      defaultValue: 'Applied',
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interviewerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'candidates',
    timestamps: true,
  }
);

module.exports = Candidate;
