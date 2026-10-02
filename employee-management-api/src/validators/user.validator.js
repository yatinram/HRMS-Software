const Joi = require('joi');
const { ROLES } = require('../constants/roles');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  role: Joi.string().valid(...Object.values(ROLES)).optional(),
  profileImage: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  role: Joi.string().valid(...Object.values(ROLES)).optional(),
  profileImage: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

const changeRoleSchema = Joi.object({
  role: Joi.string().valid(...Object.values(ROLES)).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  profileImage: Joi.string().optional(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  changeRoleSchema,
  updateProfileSchema,
  changePasswordSchema,
};
