const { sendError } = require('../utils/response');
const { FORBIDDEN } = require('../constants/messages');

const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return sendError(res, FORBIDDEN, 403, []);
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(req.user.role)) {
    return sendError(res, FORBIDDEN, 403, []);
  }

  next();
};

module.exports = { requireRole };
