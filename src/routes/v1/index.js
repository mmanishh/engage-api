/* eslint-disable no-unused-vars */
const express = require('express');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const employeeRoutes = require('./employees');
const companyRoutes = require('./companies');
const roleRoutes = require('./roles');

const router = express.Router();

const authentication = require('../../middleware/authentication');

router.use('/auth', authRoutes);
router.use('/users', authentication, userRoutes);
router.use('/employees', authentication, employeeRoutes);
router.use('/companies', authentication, companyRoutes);
router.use('/roles', authentication, roleRoutes);

module.exports = router;
