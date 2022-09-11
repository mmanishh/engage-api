const crypto = require('crypto');
const uuid = require('uuid');

module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('users', [
        {
            id: uuid.v4(),
            name: 'Manish Maharjan',
            email: 'manish@gmail.com',
            role: 'user',
            password: crypto.createHash('md5').update('hello@123').digest('hex'),
            status: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ], {}),

    down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
