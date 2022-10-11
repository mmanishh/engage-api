const express = require('express');

const router = express.Router();

const validator = require('../../middleware/validator');
const userController = require('../../controllers/user/role.controller');
const { update, getById } = require('../../controllers/user/role.schema');

router.get('/', userController.getAll);
router.get('/:id', validator(getById), userController.findById);
router.patch('/:id', validator(update), userController.update);

module.exports = router;
