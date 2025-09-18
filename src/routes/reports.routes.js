const express = require('express');
const { getReport } = require('../controllers/reports.controller');

const router = express.Router();

// דוח חודשי לפי userid/year/month
router.get('/report', getReport);

module.exports = router;
