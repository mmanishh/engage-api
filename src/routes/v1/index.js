/* eslint-disable no-unused-vars */
const express = require('express');
const userRoutes = require('./users');
const authRoutes = require('./auth');

const router = express.Router();

const authentication = require('../../middleware/authentication');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
