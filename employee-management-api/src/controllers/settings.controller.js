const { CompanySettings, AuditLog } = require('../models');
const { sendSuccess, sendCreated } = require('../utils/response');

class SettingsController {
  async getCompanySettings(req, res, next) {
    try {
      let settings = await CompanySettings.findOne();
      if (!settings) {
        settings = await CompanySettings.create({});
      }
      return sendSuccess(res, 'Company settings retrieved', settings);
    } catch (error) {
      next(error);
    }
  }

  async updateCompanySettings(req, res, next) {
    try {
      let settings = await CompanySettings.findOne();
      if (!settings) {
        settings = await CompanySettings.create(req.body);
      } else {
        await settings.update(req.body);
      }

      await AuditLog.create({
        userId: req.user.userId,
        userName: req.user.name || req.user.email,
        userRole: req.user.role,
        action: 'UPDATE_COMPANY_SETTINGS',
        module: 'Settings',
        details: 'Updated company settings',
        ipAddress: req.ip,
      });

      return sendSuccess(res, 'Settings updated successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const logs = await AuditLog.findAll({
        order: [['createdAt', 'DESC']],
        limit: 50,
      });
      return sendSuccess(res, 'Audit logs retrieved', logs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
