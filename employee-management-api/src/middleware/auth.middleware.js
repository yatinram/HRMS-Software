const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const { AUTH_REQUIRED, TOKEN_INVALID } = require('../constants/messages');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, AUTH_REQUIRED, 401, []);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return sendError(res, TOKEN_INVALID, 401, []);
    }

    // Find linked employee record
    const employee = await Employee.findOne({ where: { email: user.email } });

    req.user = {
      userId: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      employeeId: employee ? employee.id : (decoded.employeeId || null),
    };

    next();
  } catch (error) {
    return sendError(res, TOKEN_INVALID, 401, []);
  }
};

module.exports = { authMiddleware };
