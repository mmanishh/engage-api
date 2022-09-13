/* eslint-disable no-return-await */
const { Employee } = require('../../models');

exports.create = async (payload, txn = null) => (await Employee.create(payload, { transaction: txn }));

exports.findOne = async (query) => await Employee.findOne({ where: query });

exports.findByPk = async (id) => await Employee.findByPk(id);

exports.findAll = async () => await Employee.findAll();

exports.update = async (model, payload) => await model.update(payload);
