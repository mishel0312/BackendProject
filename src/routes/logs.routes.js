const express = require('express');
const { listLogs } = require('../controllers/logs.controller');

const router = express.Router();

router.get('/logs', listLogs);

module.exports = router;


