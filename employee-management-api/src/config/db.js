const { Sequelize } = require('sequelize');
const { env } = require('./env');
const logger = require('./logger');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    logger.info('Database synced successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connectDatabase,
};
