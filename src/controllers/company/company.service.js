/* eslint-disable no-return-await */
const { Company } = require('../../models');

exports.create = async (payload) => await Company.create(payload);

exports.findOne = async (query) => await Company.findOne({ where: query });

exports.findByPk = async (id) => await Company.findByPk(id);

exports.findAll = async () => await Company.findAll();
