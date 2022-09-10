/* eslint-disable no-unused-vars */

const { errorResponse } = require('../helpers/helpers');

exports.errorHandler = (err, req, res) => errorResponse(req, res, err.message);
