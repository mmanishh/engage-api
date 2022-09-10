const Sequelize = require('sequelize');
const sequelizeInstance = require('./database');

exports.User = require('./user')(sequelizeInstance, Sequelize);
exports.Company = require('./company')(sequelizeInstance, Sequelize);
