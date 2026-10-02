const Joi = require('joi');

const employeeSchema = Joi.object({
  employeeId: Joi.string().required(),
  firstName: Joi.string().trim().min(2).required(),
  lastName: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  department: Joi.string().optional(),
  designation: Joi.string().optional(),
  joiningDate: Joi.date().optional(),
  employmentType: Joi.string().valid('full_time', 'part_time', 'contract', 'intern').optional(),
  salary: Joi.number().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  profileImage: Joi.string().optional(),
  managerId: Joi.number().optional(),
  status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  emergencyContact: Joi.string().optional(),
  createdBy: Joi.number().optional(),
  updatedBy: Joi.number().optional(),
});

const employeeStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').required(),
});

module.exports = {
  employeeSchema,
  employeeStatusSchema,
};
