const {
    successResponse,
    errorResponse,
} = require('../../helpers/helpers');

const {
    DATA_DOES_NOT_EXIST,
} = require('../../helpers/messages');

const companyService = require('./company.service');

exports.create = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const data = await companyService.create(param);

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.findById = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const model = await companyService.findByPk(param.id);

        if (!model) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        return successResponse(req, res, model);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const model = await companyService.findByPk(param.id);

        if (!model) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        const updated = await companyService.update(model, { ...req.body });

        return successResponse(req, res, updated);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await companyService.findAll();

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};
