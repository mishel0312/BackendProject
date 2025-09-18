const router = require('express').Router();
const { validateAdd } = require('../middleware/validate');
const { addUser } = require('../controllers/users.controller');
const { addCost } = require('../controllers/costs.controller');

router.post('/add', validateAdd, (req, res, next) => {
  if ('id' in req.body || ('first_name' in req.body && 'last_name' in req.body)) {
    return addUser(req, res, next);
  }
  return addCost(req, res, next);
});

module.exports = router;
