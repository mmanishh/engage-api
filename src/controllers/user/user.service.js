/* eslint-disable no-return-await */
const {
    User,
} = require('../../models');

exports.create = async (payload) => await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
    status: payload.status || true,
    role: payload.role || 'user',
});

exports.findOne = async (query) => await User.findOne({ where: query });

exports.findByPk = async (id) => await User.findByPk(id);

exports.findAll = async () => await User.findAll();

exports.update = async (model, payload) => await model.update(payload);
