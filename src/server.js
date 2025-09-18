require('dotenv').config();
const { logger } = require('./config/logger');
const { connectToDatabase } = require('./config/db');
const app = require('./app');

// Read port from env or default
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Connect to MongoDB before starting server
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, 'server started');
    });

    // Handle termination
    process.on('SIGINT', () => {
      server.close(() => process.exit(0));
    });
  } catch (err) {
    logger.error({ err }, 'failed to start server');
    process.exit(1);
  }
}

start();


