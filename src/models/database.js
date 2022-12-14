const Sequelize = require('sequelize');
const config = require('../config/config');
require('dotenv').config();

const dbConfig = config[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    ...dbConfig,
});

module.exports = sequelize;
