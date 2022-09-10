require('dotenv').config();
const sequelize = require('../models/database');
const config = require('./config');
const { DB_CONNECTION_SUCCESSFUL, DB_CONNECTION_UNSUCCESSFUL } = require('../helpers/messages');

const dbConfig = config[process.env.NODE_ENV || 'development'];

exports.dbConnect = async () => {
    sequelize.authenticate().then(() => {
        console.log(`${DB_CONNECTION_SUCCESSFUL} uri: ${dbConfig.host}:${dbConfig.port}`);
    }).catch((err) => {
        console.log(DB_CONNECTION_UNSUCCESSFUL, err.message);
    });
};

exports.dbDisconnect = async () => {
    await sequelize.close().then(() => {
        console.log('DB conn closed');
    }).catch((err) => {
        console.log(err.message);
    });
};
