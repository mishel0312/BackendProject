const { logEndpointEntry } = require('../config/logger');

const team = [
  { first_name: 'Mishel', last_name: 'Yusupov' },
  { first_name: 'Yuval', last_name: 'Milis' },
];

// GET /api/about
async function getAbout(req, res) {
  logEndpointEntry('GET /api/about', req);
  res.json(team);
}

module.exports = { getAbout };
