const EmployeeService = require('../services/employee.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class EmployeeController {
  async getAll(req, res, next) {
    try {
      const data = await EmployeeService.getAll(req.query, req.user);
      return sendSuccess(res, 'Employees retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await EmployeeService.getById(req.params.id, req.user);
      return sendSuccess(res, 'Employee details retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await EmployeeService.create(req.body, req.user);
      return sendCreated(res, 'Employee created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await EmployeeService.update(req.params.id, req.body, req.user);
      return sendSuccess(res, 'Employee updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const data = await EmployeeService.updateStatus(req.params.id, req.body.status, req.user);
      return sendSuccess(res, 'Employee status updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await EmployeeService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req, res, next) {
    try {
      const csv = await EmployeeService.exportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="aventrix_employees.csv"');
      return res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
