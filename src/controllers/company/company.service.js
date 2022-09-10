/* eslint-disable no-return-await */
const { Company } = require('../../models');

exports.create = async (payload, txn = null) => await Company.create(payload, { transaction: txn });

exports.findOne = async (query) => await Company.findOne({ where: query });

exports.findByPk = async (id) => await Company.findByPk(id);

exports.findAll = async () => await Company.findAll();
