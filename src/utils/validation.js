
// Validation utilities for request payloads and query params

const ALLOWED_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

// Short validation helpers
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isPositiveNumber(n) {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0;
}

function isValidDateString(s) {
  if (s === undefined) return true; // optional
  if (!isNonEmptyString(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

// Do not allow past dates for cost creation (per project spec)
function isNotPastDate(d) {
  if (!(d instanceof Date)) return false;
  const now = new Date();
  return d.getTime() >= now.getTime();
}

// User payload: id:Number, first_name:String, last_name:String, birthday:Date (optional)
function validateUserPayload(body) {
  const errors = [];
  const { id, first_name, last_name, birthday } = body;

  if (!Number.isFinite(id)) errors.push('id must be a Number');
  if (!isNonEmptyString(first_name)) errors.push('first_name must be a non-empty String');
  if (!isNonEmptyString(last_name)) errors.push('last_name must be a non-empty String');

  if (birthday !== undefined) {
    if (!isValidDateString(birthday)) {
      errors.push('birthday must be an ISO Date string');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Cost payload: description:String, category:String (enum), userid:Number, sum:Double(Number), created_at:Date (optional, not in past)
function validateCostPayload(body) {
  const errors = [];
  const { description, category, userid, sum, created_at } = body;

  if (!isNonEmptyString(description)) errors.push('description must be a non-empty String');
  if (!isNonEmptyString(category) || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push('category must be one of: ' + ALLOWED_CATEGORIES.join(', '));
  }
  if (!Number.isFinite(userid)) errors.push('userid must be a Number');
  if (!Number.isFinite(sum)) errors.push('sum must be a Number');

  if (created_at !== undefined) {
    if (!isValidDateString(created_at)) {
      errors.push('created_at must be an ISO Date string');
    } else {
      const d = new Date(created_at);
      if (!isNotPastDate(d)) errors.push('created_at cannot be in the past');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Report query: id:Number, year:int, month:int(1-12)
function validateReportQuery(query) {
  const errors = [];
  const id = Number(query.id);
  const year = Number(query.year);
  const month = Number(query.month);

  if (!Number.isFinite(id)) errors.push('id must be a Number');
  if (!Number.isInteger(year) || year < 1970 || year > 3000) errors.push('year must be an integer between 1970 and 3000');
  if (!Number.isInteger(month) || month < 1 || month > 12) errors.push('month must be an integer 1-12');
  return { valid: errors.length === 0, errors };
}

module.exports = {
  ALLOWED_CATEGORIES,
  validateUserPayload,
  validateCostPayload,
  validateReportQuery,
};
