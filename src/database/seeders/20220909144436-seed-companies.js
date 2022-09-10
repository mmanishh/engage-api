// const uuid = require('uuid');

module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('companies', [
        {
            id: '01cf8688-b1a9-44fe-ada0-608505a0038b',
            name: 'Imar',
            website: 'www.imar.ie',
            email: 'hello@imar.ie',
            phone: '0894053659',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ], {}),

    down: (queryInterface) => queryInterface.bulkDelete('companies', null, {}),
};
