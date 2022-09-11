const Joi = require('@hapi/joi');

exports.create = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().allow(null, ''),
        phone: Joi.string().allow(null, ''),
        company: Joi.object(),
    }),
};

exports.update = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
    }),
};

exports.getById = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
};
