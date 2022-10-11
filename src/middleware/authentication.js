require('dotenv').config();

const jwt = require('jsonwebtoken');

const {
    errorResponse,
} = require('../helpers/helpers');

const {
    NO_TOKEN_PROVIDED,
    TOKEN_EXPIRED,
    USER_NOT_EXIST,
    USER_ACC_DISABLED,
} = require('../helpers/messages');

const {
    findByPk,
} = require('../controllers/user/role.service');

const { secretKey } = require('../config/config');

async function authentication(req, res, next) {
    let decoded;

    if (!(req.headers && req.headers.authorization)) {
        return errorResponse(req, res, NO_TOKEN_PROVIDED, 401);
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        decoded = jwt.decode(token);
        jwt.verify(token, secretKey);
    } catch (error) {
        if (error.message === 'jwt expired') {
            return errorResponse(req, res, TOKEN_EXPIRED, 401);
        }
        return errorResponse(req, res, error.message, 401);
    }

    const data = await findByPk(decoded.id);
    if (!data) return errorResponse(req, res, USER_NOT_EXIST, 401);
    if (!data.status) return errorResponse(req, res, USER_ACC_DISABLED, 401);

    req.user = data;

    res.locals.ROLE = data.role;
    res.locals.METHOD = req.method;
    res.locals.URL = req.url;

    return next();
}

module.exports = authentication;
