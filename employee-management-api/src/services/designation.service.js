const { Designation, Department } = require('../models');

class DesignationService {
  async getAll(query = {}) {
    const where = {};
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.status) where.status = query.status;

    return Designation.findAll({
      where,
      order: [['title', 'ASC']],
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });
  }

  async create(payload) {
    if (payload.departmentId) {
      const dept = await Department.findByPk(payload.departmentId);
      if (dept) payload.departmentName = dept.name;
    }
    return Designation.create(payload);
  }

  async update(id, payload) {
    const designation = await Designation.findByPk(id);
    if (!designation) {
      const error = new Error('Designation not found');
      error.statusCode = 404;
      throw error;
    }

    if (payload.departmentId) {
      const dept = await Department.findByPk(payload.departmentId);
      if (dept) payload.departmentName = dept.name;
    }

    await designation.update(payload);
    return designation;
  }

  async delete(id) {
    const designation = await Designation.findByPk(id);
    if (!designation) {
      const error = new Error('Designation not found');
      error.statusCode = 404;
      throw error;
    }

    await designation.destroy();
    return { success: true, message: 'Designation removed' };
  }
}

module.exports = new DesignationService();
