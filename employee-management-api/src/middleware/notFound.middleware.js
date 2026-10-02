const { sendError } = require('../utils/response');

const notFoundMiddleware = (req, res) => {
  return sendError(res, 'Route not found', 404, []);
};

module.exports = notFoundMiddleware;
