/* eslint-disable no-unused-vars */
const express = require('express');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const employeeRoutes = require('./employees');
const companyRoutes = require('./companies');

const router = express.Router();

const authentication = require('../../middleware/authentication');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/companies', companyRoutes);

module.exports = router;
