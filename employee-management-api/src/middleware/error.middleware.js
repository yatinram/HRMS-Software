const logger = require('../config/logger');
const { sendError } = require('../utils/response');

const errorMiddleware = (error, req, res, next) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const errors = process.env.NODE_ENV === 'production' ? [] : [message];

  return sendError(res, message, statusCode, errors);
};

module.exports = errorMiddleware;
