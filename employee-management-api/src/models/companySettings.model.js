const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CompanySettings = sequelize.define(
  'CompanySettings',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyName: {
      type: DataTypes.STRING,
      defaultValue: 'Aventrix Technologies Ltd.',
    },
    companyEmail: {
      type: DataTypes.STRING,
      defaultValue: 'hr@aventrix.com',
    },
    companyPhone: {
      type: DataTypes.STRING,
      defaultValue: '+1 (800) 555-0199',
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: '100 Enterprise Boulevard, Suite 400',
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: 'San Francisco',
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'United States',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    currencySymbol: {
      type: DataTypes.STRING,
      defaultValue: '$',
    },
    workWeekDays: {
      type: DataTypes.JSON,
      defaultValue: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    dailyWorkingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 8.0,
    },
    lateGracePeriodMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },
    casualLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 12,
    },
    sickLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    paidLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },
    earnedLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 8,
    },
    holidays: {
      type: DataTypes.JSON,
      defaultValue: [
        { name: "New Year's Day", date: '2026-01-01' },
        { name: 'Memorial Day', date: '2026-05-25' },
        { name: 'Independence Day', date: '2026-07-04' },
        { name: 'Labor Day', date: '2026-09-07' },
        { name: 'Thanksgiving Day', date: '2026-11-26' },
        { name: 'Christmas Day', date: '2026-12-25' },
      ],
    },
  },
  {
    tableName: 'company_settings',
    timestamps: true,
  }
);

module.exports = CompanySettings;
