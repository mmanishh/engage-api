/* eslint-disable class-methods-use-this */
const Sequelize = require('sequelize-mock');

class SequelizeMock extends Sequelize {
    sync() {
        return Promise.resolve();
    }
}
module.exports = SequelizeMock;
