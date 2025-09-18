// src/routes/index.js
const router = require('express').Router();

router.use(require('./add.routes'));     // '/add'  – נתיב מאוחד ל-User/Cost
router.use(require('./users.routes'));   // '/users' + '/users/:id'
router.use(require('./reports.routes')); // '/report'
router.use(require('./logs.routes'));    // '/logs'
router.use(require('./about.routes'));   // '/about'

module.exports = router;
