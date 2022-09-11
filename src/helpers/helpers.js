const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// needs refresh token
const JWT_TOKEN_EXPIRATION_TIME = '14d';

const {
    SOMETHING_WENT_WRONG,
    OPERATION_COMPLETED,
} = require('./messages');

const { secretKey } = require('../config/config');

exports.successResponse = (req, res, data, message = OPERATION_COMPLETED, code = 200) => {
    res.status(code);
    res.send({
        code,
        success: true,
        message,
        data,
    });
};

exports.errorResponse = (req, res, message = SOMETHING_WENT_WRONG, code = 500) => {
    res.status(code);
    res.send({
        code,
        success: false,
        message,
        data: null,
    });
};

exports.generateJWTtoken = (object, secret = secretKey) => jwt.sign(JSON.parse(JSON.stringify(object)), secret, { expiresIn: JWT_TOKEN_EXPIRATION_TIME });

exports.comparePassword = (paramPass, dbPass) => {
    const password = crypto
        .createHash('md5')
        .update(paramPass)
        .digest('hex');

    if (password === dbPass) {
        return true;
    }
    return false;
};
