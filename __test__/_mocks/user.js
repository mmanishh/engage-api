/* eslint-disable import/no-extraneous-dependencies */
exports.mockUser = () => {
    const SequelizeMock = require('sequelize-mock');
    const crypto = require('crypto');

    const dbMock = new SequelizeMock();
    const userMockModel = dbMock.define('user');

    const users = [
        {
            id: '17ecdb90-dc9b-4b68-b8fb-ca4f7545ebc0',
            name: 'Manish Maharjan',
            email: 'manish@gmail.com',
            role: 'user',
            password: crypto.createHash('md5').update('hello@123').digest('hex'),
            status: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '7ed49084-650b-4906-8b5f-2d1a240cbe43',
            name: 'John Bar',
            email: 'john@gmail.com',
            password: 'hello@123',
            role: 'user',
            status: true,
            createdAt: '2022-09-07T13:47:28.801Z',
            updatedAt: '2022-09-07T14:49:31.567Z',
        }];

    const userTestObject = userMockModel.build(users[0]);

    userTestObject.update = (data) => {
        userTestObject.isUpdated = true;
        userTestObject.name = data.name;
        return Promise.resolve();
    };

    userTestObject.destroy = () => {
        userTestObject.isDestroyed = true;
        return Promise.resolve();
    };

    const testModelInstances = [
        userTestObject,
        userMockModel.build(users[1]),
    ];

    // Mock model method overrides for tests below
    userMockModel.findAll = () => Promise.resolve(testModelInstances);
    userMockModel.findOne = ({ where }) => {
        if (!where) return;
        const { email } = where;
        if (!email) return;
        const user = users.find((e) => e.email === email);
        if (!user) return;
        return Promise.resolve(userMockModel.build(user));
    };
    // userMockModel.findByPk = (query) => () => Promise.resolve(testModelInstances[0]);
    userMockModel.findByPk = (id) => {
        const user = users.find((e) => e.id === id);
        if (!user) return;
        return Promise.resolve(userMockModel.build(user));
    };

    userMockModel.create = (data) => {
        testModelInstances.push(data);
        return Promise.resolve();
    };

    // Mock test helper methods
    userMockModel.mockHelperGetLastCreated = () => testModelInstances[testModelInstances.length - 1];
    userMockModel.mockHelperIsUpdateCalled = () => testModelInstances[0].isUpdated;
    userMockModel.mockHelperIsDestroyCalled = () => testModelInstances[0].isDestroyed;

    return userMockModel;
};
