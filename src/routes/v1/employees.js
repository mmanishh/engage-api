const express = require('express');

const router = express.Router();

const validator = require('../../middleware/validator');
const employeeController = require('../../controllers/employee/employee.controller');
const { update, getById, create } = require('../../controllers/employee/employee.schema');

router.get('/', employeeController.getAll);
router.post('/', validator(create), employeeController.create);
router.get('/:id', validator(getById), employeeController.findById);
router.patch('/:id', validator(update), employeeController.update);

module.exports = router;
