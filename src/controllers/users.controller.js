const { logEndpointEntry } = require('../config/logger');
const User = require('../models/users.model');
const Cost = require('../models/costs.model');

// POST /api/add (user)
async function addUser(req, res) {
  logEndpointEntry('POST /api/add (user)', req);
  try {
    const { id, first_name, last_name, birthday } = req.body;

    const exists = await User.findOne({ id });
    if (exists) return res.status(409).json({ error: 'user exists' });

    const payload = { id, first_name, last_name };
    if (birthday) payload.birthday = birthday;

    const doc = await User.create(payload);
    return res.status(201).json({
      id: doc.id,
      first_name: doc.first_name,
      last_name: doc.last_name,
      birthday: doc.birthday ?? null,
    });
  } catch (_err) {
    return res.status(500).json({ error: 'internal error' });
  }
}

// GET /api/users/:id  -> { first_name, last_name, id, total }
async function getUserById(req, res) {
  logEndpointEntry('GET /api/users/:id', req);
  try {
    const id = Number(req.params.id);

    const user = await User.findOne(
      { id },
      { _id: 0, id: 1, first_name: 1, last_name: 1 }
    );
    if (!user) return res.status(404).json({ error: 'not found' });

    const agg = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: '$sum' } } },
    ]);
    const total = agg && agg.length ? agg[0].total : 0;

    return res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total,
    });
  } catch (_err) {
    return res.status(500).json({ error: 'internal error' });
  }
}

// GET /api/users
async function listUsers(req, res) {
  logEndpointEntry('GET /api/users', req);
  try {
    const users = await User.find(
      {},
      { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 }
    );
    return res.json(users || []);
  } catch (_err) {
    return res.status(500).json({ error: 'internal error' });
  }
}

module.exports = { addUser, getUserById, listUsers };
