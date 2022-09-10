/* eslint-disable no-unused-vars */
const {
    successResponse,
    errorResponse,
} = require('../../helpers/helpers');

const {
    DATA_DOES_NOT_EXIST,
} = require('../../helpers/messages');

const employeeService = require('./employee.service');
const companyService = require('../company/company.service');
const sequelize = require('../../models/database');

exports.create = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };
        const { company } = param;

        const result = await sequelize.transaction(async (txn) => {
            const companyCreated = await companyService.create(company, txn);
            const payload = { ...param, CompanyId: companyCreated.id };
            const employee = await employeeService.create(payload, txn);
            return employee;
        });

        return successResponse(req, res, result);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.findById = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const employee = await employeeService.findByPk(param.id);

        if (!employee) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        return successResponse(req, res, employee);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const employee = await employeeService.findByPk(param.id);

        if (!employee) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        const updated = await employee.update({ ...req.body });

        return successResponse(req, res, updated);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await employeeService.findAll();

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};
