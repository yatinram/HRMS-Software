const { Onboarding } = require('../models');

class OnboardingService {
  async getAll(query = {}) {
    const where = {};
    if (query.status) where.status = query.status;

    return Onboarding.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async create(payload) {
    return Onboarding.create(payload);
  }

  async toggleTask(id, taskId) {
    const record = await Onboarding.findByPk(id);
    if (!record) {
      const error = new Error('Onboarding record not found');
      error.statusCode = 404;
      throw error;
    }

    const tasks = (record.tasks || []).map((t) => {
      if (t.id === Number(taskId)) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    const allCompleted = tasks.every((t) => t.completed);
    const someCompleted = tasks.some((t) => t.completed);
    const status = allCompleted ? 'Completed' : someCompleted ? 'In Progress' : 'Pending';

    await record.update({ tasks, status });
    return record;
  }

  async updateStatus(id, status, notes) {
    const record = await Onboarding.findByPk(id);
    if (!record) {
      const error = new Error('Onboarding record not found');
      error.statusCode = 404;
      throw error;
    }

    const updates = { status };
    if (notes !== undefined) updates.notes = notes;

    await record.update(updates);
    return record;
  }
}

module.exports = new OnboardingService();
