const TeamService = require('../services/team.service');
const { sendSuccess } = require('../utils/response');

class TeamController {
  async getMyTeam(req, res, next) {
    try {
      const data = await TeamService.getMyTeam(req.user);
      return sendSuccess(res, 'Team details retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getTeamProjects(req, res, next) {
    try {
      const data = await TeamService.getTeamProjects(req.user);
      return sendSuccess(res, 'Team projects retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async assignManager(req, res, next) {
    try {
      const { employeeId, managerId } = req.body;
      const data = await TeamService.assignManager(employeeId, managerId);
      return sendSuccess(res, 'Manager assigned successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
