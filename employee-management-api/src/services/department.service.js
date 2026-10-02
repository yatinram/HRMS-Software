const { Department, Designation, Employee, User } = require('../models');

class DepartmentService {
  async getAll() {
    const departments = await Department.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
        {
          model: Designation,
          as: 'designations',
        },
      ],
    });

    // Add employee count to each department
    const results = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.count({
          where: { department: dept.name, status: 'active' },
        });
        return {
          ...dept.toJSON(),
          employeeCount,
        };
      })
    );

    return results;
  }

  async getById(id) {
    const department = await Department.findByPk(id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Designation,
          as: 'designations',
        },
      ],
    });

    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    const employees = await Employee.findAll({
      where: { department: department.name },
      attributes: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'designation', 'status', 'profileImage'],
    });

    return {
      ...department.toJSON(),
      employees,
    };
  }

  async create(payload) {
    const existing = await Department.findOne({ where: { name: payload.name } });
    if (existing) {
      const error = new Error('Department with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    return Department.create(payload);
  }

  async update(id, payload) {
    const department = await Department.findByPk(id);
    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    await department.update(payload);
    return department;
  }

  async delete(id) {
    const department = await Department.findByPk(id);
    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    const employeeCount = await Employee.count({ where: { department: department.name } });
    if (employeeCount > 0) {
      const error = new Error(
        `Cannot delete department "${department.name}" because it still has ${employeeCount} active employee(s) assigned. Please reassign them first.`
      );
      error.statusCode = 400;
      throw error;
    }

    await Designation.destroy({ where: { departmentId: id } });
    await department.destroy();
    return { success: true, message: 'Department deleted successfully' };
  }
}

module.exports = new DepartmentService();
