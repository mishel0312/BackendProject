const express = require('express');
const { getUserById, listUsers } = require('../controllers/users.controller');

const router = express.Router();

// Users endpoints
router.get('/users/:id', getUserById);
router.get('/users', listUsers);

module.exports = router;