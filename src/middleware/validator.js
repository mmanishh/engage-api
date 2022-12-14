const Joi = require('@hapi/joi');
const pick = require('../helpers/pick');
const { errorResponse } = require('../helpers/helpers');

const validator = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        return errorResponse(req, res, errorMessage, 400);
    }
    Object.assign(req, value);
    return next();
};

module.exports = validator;
