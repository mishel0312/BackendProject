const { logEndpointEntry } = require('../config/logger');
const Log = require('../models/logs.model');

// GET /api/logs
async function listLogs(req, res) {
  logEndpointEntry('GET /api/logs', req);
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 }).lean();
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
}

module.exports = { listLogs };
