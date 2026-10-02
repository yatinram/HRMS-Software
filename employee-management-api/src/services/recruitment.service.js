const { Candidate } = require('../models');

class RecruitmentService {
  async getAll(query = {}) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.department) where.department = query.department;

    return Candidate.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async create(payload) {
    return Candidate.create(payload);
  }

  async updateStatus(id, status, notes, interviewDate, interviewerName) {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      const error = new Error('Candidate not found');
      error.statusCode = 404;
      throw error;
    }

    const updates = { status };
    if (notes) updates.notes = notes;
    if (interviewDate) updates.interviewDate = interviewDate;
    if (interviewerName) updates.interviewerName = interviewerName;

    await candidate.update(updates);
    return candidate;
  }

  async delete(id) {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      const error = new Error('Candidate not found');
      error.statusCode = 404;
      throw error;
    }

    await candidate.destroy();
    return { success: true, message: 'Candidate removed' };
  }
}

module.exports = new RecruitmentService();
