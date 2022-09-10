const express = require('express');

const router = express.Router();

const validator = require('../../middleware/validator');
const companyController = require('../../controllers/company/company.controller');
const { update, getById, create } = require('../../controllers/company/company.schema');

router.get('/', companyController.getAll);
router.post('/', validator(create), companyController.create);
router.get('/:id', validator(getById), companyController.findById);
router.put('/:id', validator(update), companyController.update);

module.exports = router;
