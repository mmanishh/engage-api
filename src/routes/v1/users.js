const express = require('express');

const router = express.Router();

const validator = require('../../middleware/validator');
const userController = require('../../controllers/user/user.controller');
const { update, getById } = require('../../controllers/user/user.schema');

router.get('/', userController.getAll);
router.get('/:id', validator(getById), userController.findById);
router.put('/:id', validator(update), userController.update);

module.exports = router;
