const pino = require('pino');
const pinoHttp = require('pino-http');
const Log = require('../models/logs.model');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// HTTP logging
const httpLogger = pinoHttp({ logger });

function persistRequestLog(req, res, next) {
  const shouldPersist = process.env.NODE_ENV !== 'test' && process.env.LOG_PERSIST_DISABLED !== 'true';

  res.on('finish', async () => {
    if (!shouldPersist) return;

    const level =
      res.statusCode >= 500 ? 'error' :
      res.statusCode >= 400 ? 'warn'  : 'info';

    const rec = {
      level,
      message: 'request finished',
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    };

    try {
      if (Log && typeof Log.create === 'function') {
        await Log.create(rec);
      } else {
        logger.debug({ rec }, 'Log.create not available');
      }
    } catch (err) {
      logger.error({ err }, 'failed to persist http log');
    }
  });

  next();
}

function logEndpointEntry(name, req) {
  logger.info({ endpoint: name, method: req?.method, url: req?.originalUrl }, 'endpoint entry');
}

const endpointEntry = (name) => (req, _res, next) => {
  logEndpointEntry(name, req);
  next();
};

module.exports = {
  logger,
  httpLogger,
  persistRequestLog,
  logEndpointEntry,
  endpointEntry,
};
