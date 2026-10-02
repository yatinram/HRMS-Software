const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define(
  'Attendance',
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    breakDurationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalWorkingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday'),
      defaultValue: 'Present',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    correctionRequestStatus: {
      type: DataTypes.ENUM('None', 'Pending', 'Approved', 'Rejected'),
      defaultValue: 'None',
    },
    correctionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requestedCheckIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    requestedCheckOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'attendance',
    timestamps: true,
    indexes: [
      { fields: ['employeeId', 'date'], unique: true },
      { fields: ['date'] },
      { fields: ['status'] },
    ],
  }
);

module.exports = Attendance;
