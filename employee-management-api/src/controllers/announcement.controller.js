const AnnouncementService = require('../services/announcement.service');
const { sendSuccess, sendCreated } = require('../utils/response');

class AnnouncementController {
  async getAll(req, res, next) {
    try {
      const data = await AnnouncementService.getAll();
      return sendSuccess(res, 'Announcements retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await AnnouncementService.create(req.body, req.user);
      return sendCreated(res, 'Announcement published', data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await AnnouncementService.delete(req.params.id);
      return sendSuccess(res, data.message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnnouncementController();
