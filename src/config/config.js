require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
    },
    test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASS_TEST,
        database: 'testing',
        host: process.env.DB_HOST_TEST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT_TEST,
        logging: false,
    },
    staging: {
        username: process.env.DB_USER_STAGING,
        password: process.env.DB_PASS_STAGING,
        database: process.env.DB_NAME_STAGING,
        host: process.env.DB_HOST_STAGING,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT_STAGING,
        logging: false,
    },
    production: {
        username: process.env.DB_USER_PROD,
        password: process.env.DB_PASS_PROD,
        database: process.env.DB_NAME_PROD,
        host: process.env.DB_HOST_PROD,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT_PROD,
        logging: false,
    },
};
