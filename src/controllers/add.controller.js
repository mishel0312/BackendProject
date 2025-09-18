const { addUser } = require('./users.controller');
const { addCost } = require('./costs.controller');

/**
 * Unified /api/add controller
 * Decides whether to add a user or a cost according to body shape.
 * - User if body has: id, first_name, last_name (birthday optional)
 * - Cost if body has: userid, description, category, sum (created_at optional)
 */
async function addUnified(req, res) {
  const b = req.body || {};
  const isUser = b && b.id !== undefined && b.first_name && b.last_name;
  const isCost = b && b.userid !== undefined && b.description && b.category && (b.sum !== undefined);

  if (isUser && isCost) {
    // Ambiguous — prefer explicit error so the client fixes payload
    return res.status(400).json({ error: 'ambiguous payload: either user or cost fields, not both' });
  }

  if (isUser) return addUser(req, res);
  if (isCost) return addCost(req, res);

  return res.status(400).json({ error: 'invalid payload: missing required fields for user or cost' });
}

module.exports = { addUnified };