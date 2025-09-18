
const VALID_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

// /api/add - מזהים אם זה user או cost לפי השדות, ומבצעים בדיקות בסיסיות
function validateAdd(req, res, next) {
  const b = req.body || {};
  const isUser = 'id' in b || ('first_name' in b && 'last_name' in b);
  const isCost = 'userid' in b || ('description' in b && 'category' in b);

  const errors = [];

  if (isUser) {
    if (typeof b.id !== 'number') errors.push('id must be a number');
    if (typeof b.first_name !== 'string' || !b.first_name.trim())
      errors.push('first_name is required');
    if (typeof b.last_name !== 'string' || !b.last_name.trim())
      errors.push('last_name is required');
    if (b.birthday !== undefined) {
      const d = new Date(b.birthday);
      if (isNaN(d.getTime())) errors.push('birthday must be a valid date');
    }
  } else if (isCost) {
    if (typeof b.description !== 'string' || !b.description.trim())
      errors.push('description is required');
    if (typeof b.category !== 'string' || !VALID_CATEGORIES.includes(b.category))
      errors.push('category must be one of ' + VALID_CATEGORIES.join(', '));
    if (typeof b.userid !== 'number') errors.push('userid must be a number');
    if (typeof b.sum !== 'number') errors.push('sum must be a number');
    if (b.created_at !== undefined) {
      const d = new Date(b.created_at);
      if (isNaN(d.getTime())) errors.push('created_at must be a valid date');
    }
  } else {
    errors.push('invalid body');
  }

  if (errors.length) return res.status(400).json({ errors });
  next();
}

function validateReport(req, res, next) {
  const { id, year, month } = req.query || {};
  const errors = [];
  if (id === undefined || year === undefined || month === undefined) {
    errors.push('id, year, month are required');
  } else {
    if (isNaN(Number(id))) errors.push('id must be a number');
    if (isNaN(Number(year))) errors.push('year must be a number');
    if (isNaN(Number(month))) errors.push('month must be a number');
  }
  if (errors.length) return res.status(400).json({ errors });
  next();
}

module.exports = { validateAdd, validateReport };
