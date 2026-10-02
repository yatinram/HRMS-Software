const ExpenseService = require('../services/expense.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class ExpenseController {
  async getAll(req, res, next) {
    try {
      const data = await ExpenseService.getAll(req.query, req.user);
      return sendSuccess(res, 'Expense claims retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await ExpenseService.create(req.body, req.user);
      return sendCreated(res, 'Expense claim submitted', data);
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await ExpenseService.review(req.params.id, 'Approved', reviewComment, req.user);
      return sendSuccess(res, 'Expense claim approved', data);
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const { reviewComment } = req.body;
      const data = await ExpenseService.review(req.params.id, 'Rejected', reviewComment, req.user);
      return sendSuccess(res, 'Expense claim rejected', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();
