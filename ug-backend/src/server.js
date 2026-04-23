require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./utils/logger');
const { initializeFirebase } = require('./services/firebaseService');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('MONGODB_URI is not defined in environment variables. Exiting.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not defined in environment variables. Exiting.');
  process.exit(1);
}

/**
 * Connect to MongoDB and start the HTTP server.
 */
const startServer = async () => {
  try {
    // Initialize Firebase Admin SDK
    initializeFirebase();

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`🚀 UG Backend running on port ${PORT} [${process.env.NODE_ENV}]`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });

    // ─── Graceful Shutdown ──────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Gracefully shutting down...`);
      server.close(async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
