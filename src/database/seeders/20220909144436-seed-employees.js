module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('employees', [
        {
            id: 'aa6fff92-4cbb-4575-80be-1e6b954d279e',
            firstName: 'Manish',
            lastName: 'Maharjan',
            email: 'mmaharjann@gmail.com',
            phone: '0894053659',
            CompanyId: '01cf8688-b1a9-44fe-ada0-608505a0038b',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ], {}),

    down: (queryInterface) => queryInterface.bulkDelete('employees', null, {}),
};
