const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashPasswordValue) => {
  return bcrypt.compare(plainPassword, hashPasswordValue);
};

module.exports = {
  hashPassword,
  comparePassword,
};
