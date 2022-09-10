const express = require('express');

const router = express.Router();

const validator = require('../../middleware/validator');
const userController = require('../../controllers/user/user.controller');
const { login, register } = require('../../controllers/user/user.schema');

const authentication = require('../../middleware/authentication');

router.post('/register', validator(register), userController.register);
router.post('/login', validator(login), userController.login);
router.get('/profile', authentication, userController.profile);

module.exports = router;
