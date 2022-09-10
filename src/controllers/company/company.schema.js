const Joi = require('@hapi/joi');

exports.create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email(),
        phone: Joi.string(),
        website: Joi.string().uri(),
    }),
};

exports.update = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        website: Joi.string().uri(),
    }),
};

exports.getById = {
    params: Joi.object().keys({
        id: Joi.string().guid().required(),
    }),
};
