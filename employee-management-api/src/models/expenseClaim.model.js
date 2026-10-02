const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ExpenseClaim = sequelize.define(
  'ExpenseClaim',
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Travel', 'Meals', 'Equipment', 'Training', 'Office Supplies', 'Other'),
      defaultValue: 'Travel',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    claimDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
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
    tableName: 'expense_claims',
    timestamps: true,
    indexes: [{ fields: ['employeeId'] }, { fields: ['status'] }],
  }
);

module.exports = ExpenseClaim;
