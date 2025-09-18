// src/middleware/request-logger.js
const { httpLogger, persistRequestLog } = require('../config/logger');

// לוגים גלובליים
module.exports = [httpLogger, persistRequestLog];

