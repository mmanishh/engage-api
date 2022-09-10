const sequelize = require('../models/database');
const { DB_CONNECTION_SUCCESSFUL, DB_CONNECTION_UNSUCCESSFUL } = require('../helpers/messages');

exports.dbConnect = async () => {
    sequelize.authenticate().then(() => {
        console.info(DB_CONNECTION_SUCCESSFUL);
    }).catch((err) => {
        console.error(DB_CONNECTION_UNSUCCESSFUL, err.message);
    });
};

exports.dbDisconnect = async () => {
    await sequelize.close();
};
