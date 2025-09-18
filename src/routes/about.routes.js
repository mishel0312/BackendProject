const express = require('express');
const { getAbout } = require('../controllers/about.controller');

const router = express.Router();

router.get('/about', getAbout);

module.exports = router;


