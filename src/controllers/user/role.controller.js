const {
    successResponse,
    errorResponse,
    generateJWTtoken,
    comparePassword,
} = require('../../helpers/helpers');

const {
    DATA_DOES_NOT_EXIST,
    INVALID_UNAME_PWORD,
    DATA_ALREADY_EXIST,
    NO_USER_FOUND,
} = require('../../helpers/messages');

const userService = require('./role.service');

exports.register = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const user = await userService.findOne({ email: param.email.toLowerCase() });

        if (user) return errorResponse(req, res, DATA_ALREADY_EXIST, 400);

        const data = await userService.create(param);

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };
        const email = param.email.toLowerCase();

        const user = await userService.findOne({ email: email.toLowerCase() });

        if (!user) return errorResponse(req, res, NO_USER_FOUND, 401);

        const output = comparePassword(param.password, user.password);

        if (!output) return errorResponse(req, res, INVALID_UNAME_PWORD, 401);

        const token = generateJWTtoken({ id: user.id, role: user.role });

        const data = {
            user,
            token,
        };

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.findById = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const user = await userService.findByPk(param.id);

        if (!user) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        return successResponse(req, res, user);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const param = { ...req.body, ...req.params, ...req.query };

        const user = await userService.findByPk(param.id);

        if (!user) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        const updated = await userService.update(user, { ...req.body });

        return successResponse(req, res, updated);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.profile = async (req, res) => {
    try {
        const data = await userService.findByPk(req.user.id);

        if (!data) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 404);

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await userService.findAll();

        return successResponse(req, res, data);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};
