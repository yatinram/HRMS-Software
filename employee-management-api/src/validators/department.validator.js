const Joi = require('joi');

const departmentSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().allow('').optional(),
  managerId: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  departmentSchema,
};
