const Joi = require('@hapi/joi');

exports.login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

exports.register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().required(),
        password: Joi.string().required(),
        status: Joi.boolean(),
    }),
};

exports.update = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        role: Joi.string(),
        password: Joi.string(),
        status: Joi.boolean(),
    }),
};

exports.getById = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
};
