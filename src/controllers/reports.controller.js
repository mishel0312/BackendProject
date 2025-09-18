const { logEndpointEntry } = require('../config/logger');
const { getMonthlyReport } = require('../services/report-compute.service');

// GET /api/report?id=...&year=...&month=...
async function getReport(req, res) {
  await logEndpointEntry('GET /api/report', req);

  try {
    const userid = Number(req.query.id);
    const year   = Number(req.query.year);
    const month  = Number(req.query.month);

    if (
      !Number.isInteger(userid) ||
      !Number.isInteger(year)   ||
      !Number.isInteger(month)  ||
      month < 1 || month > 12
    ) {
      return res.status(400).json({ error: 'bad parameters' });
    }

    const report = await getMonthlyReport({ id: userid, year, month });
    return res.status(200).json(report);

  } catch (err) {
    if (err && (err.code === 'BAD_PARAMS')) {
      return res.status(400).json({ error: 'bad parameters' });
    }
    if (err && (err.code === 'USER_NOT_FOUND')) {
      return res.status(404).json({ error: 'user not found' });
    }
    return res.status(500).json({ error: 'internal error' });
  }
}

module.exports = { getReport };
