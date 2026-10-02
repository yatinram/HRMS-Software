const { sendError } = require('../utils/response');
const { VALIDATION_FAILED } = require('../constants/messages');

const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source];
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return sendError(res, VALIDATION_FAILED, 422, errors);
  }

  req[source] = value;
  next();
};

const validateBody = (schema) => validate(schema, 'body');
const validateQuery = (schema) => validate(schema, 'query');
const validateParams = (schema) => validate(schema, 'params');

module.exports = { validate, validateBody, validateQuery, validateParams };
