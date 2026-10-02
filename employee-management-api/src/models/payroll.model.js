const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define(
  'Payroll',
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
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    basicSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    hra: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    allowances: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    bonus: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    taxDeduction: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    pfDeduction: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    otherDeductions: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    netSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Processing', 'Paid'),
      defaultValue: 'Pending',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'Bank Transfer',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'payroll',
    timestamps: true,
    indexes: [
      { fields: ['employeeId', 'month', 'year'], unique: true },
      { fields: ['paymentStatus'] },
    ],
  }
);

module.exports = Payroll;
