const mongoose = require('mongoose');
const Cost   = require('../models/costs.model');
const Report = require('../models/reports.model');
const User   = require('../models/users.model');

const CATEGORIES = ['food', 'education', 'health', 'housing', 'sports'];

function monthWindowUTC(year, month) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end   = new Date(Date.UTC(year, month    , 1, 0, 0, 0));
  return { start, end };
}

function buildReport(userid, year, month, docs) {
  const bucket = Object.fromEntries(CATEGORIES.map(c => [c, []]));
  for (const c of docs) {
    if (!CATEGORIES.includes(c.category)) continue;
    const d = c.created_at ? new Date(c.created_at) : null;
    const day = d && !isNaN(d) ? d.getUTCDate() : null;
    if (day == null) continue;
    bucket[c.category].push({ sum: c.sum, description: c.description, day });
  }
  return {
    userid,
    year,
    month,
    costs: CATEGORIES.map(c => ({ [c]: bucket[c] })),
  };
}

function isPastMonthUTC(year, month) {
  const now = new Date();
  const thisMonthStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const { end } = monthWindowUTC(year, month);
  return end.getTime() <= thisMonthStartUTC.getTime();
}

async function ensureUserExists(userid) {
  try {
    if (mongoose.connection.readyState !== 1) {
      const e = new Error('user not found (no db connection)');
      e.code = 'USER_NOT_FOUND';
      throw e;
    }
    const u = await User.findOne({ id: userid }).lean();
    if (!u) {
      const e = new Error('user not found');
      e.code = 'USER_NOT_FOUND';
      throw e;
    }
  } catch (err) {
    if (err && (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message?.includes('not connected'))) {
      const e = new Error('user not found');
      e.code = 'USER_NOT_FOUND';
      throw e;
    }
    if (err && err.code === 'USER_NOT_FOUND') throw err;
    throw err;
  }
}

async function getMonthlyReport({ id, year, month }) {
  const userid = Number(id);
  const y = Number(year);
  const m = Number(month);

  if (!Number.isInteger(userid) || !Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) {
    const e = new Error('bad parameters');
    e.code = 'BAD_PARAMS';
    throw e;
  }

  // בדיקת קיום משתמש 
  await ensureUserExists(userid);

  const { start, end } = monthWindowUTC(y, m);
  const past = isPastMonthUTC(y, m);

  if (past) {
    const cached = await Report.findOne({ userid, year: y, month: m }).lean();
    if (cached?.costs) {
      return { userid, year: y, month: m, costs: cached.costs };
    }
  }

  const docs = await Cost.find({ userid, created_at: { $gte: start, $lt: end } }).lean();
  const report = buildReport(userid, y, m, docs);

  if (past) {
    await Report.updateOne(
      { userid, year: y, month: m },
      { $set: { costs: report.costs } },
      { upsert: true }
    );
  }

  return report;
}

module.exports = { getMonthlyReport };
