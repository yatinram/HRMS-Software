const app = require('./app');
const { env } = require('./config/env');
const { connectDatabase } = require('./config/db');
const logger = require('./config/logger');

// Load all models and associations
require('./models');

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`=================================================`);
      logger.info(`  Aventrix HRMS API Server`);
      logger.info(`  Environment: ${env.NODE_ENV}`);
      logger.info(`  Port: ${env.PORT}`);
      logger.info(`  URL: http://localhost:${env.PORT}`);
      logger.info(`  Health: http://localhost:${env.PORT}/health`);
      logger.info(`=================================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
