/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest');
const {
    expect,
    describe,
    beforeEach,
} = require('@jest/globals');
const app = require('../src/app');
const {
    NO_TOKEN_PROVIDED, NO_USER_FOUND, DATA_DOES_NOT_EXIST, USER_NOT_EXIST, INVALID_UNAME_PWORD,
} = require('../src/helpers/messages');
const { userDummy, tokenExpired, tokenInvalid } = require('./data/userData');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));

// Mock the User model with some test data and add both model method overrides
// TODO : refactor in seperate file
jest.mock('../src/models/user', () => () => {
    const SequelizeMock = require('sequelize-mock');
    const crypto = require('crypto');

    const dbMock = new SequelizeMock();
    const userMockModel = dbMock.define('user');

    const { mockUsersData } = require('./data/mockUserData');

    const userTestObject = userMockModel.build(mockUsersData[0]);

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
        userMockModel.build(mockUsersData[1]),
    ];

    // Mock model method overrides for tests below
    userMockModel.findAll = () => Promise.resolve(testModelInstances);
    userMockModel.findOne = ({ where }) => {
        if (!where) return;
        const { email } = where;
        if (!email) return;
        const user = mockUsersData.find((e) => e.email === email);
        if (!user) return;
        return Promise.resolve(userMockModel.build(user));
    };
    // userMockModel.findByPk = (query) => () => Promise.resolve(testModelInstances[0]);
    userMockModel.findByPk = (id) => {
        const user = mockUsersData.find((e) => e.id === id);
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
});

let authorizationToken;
const userId = '17ecdb90-dc9b-4b68-b8fb-ca4f7545ebc0';

beforeEach(async () => {
    jest.clearAllMocks();
});

describe('user', () => {
    /* auth endpoints start */

    test('register user with correct payload', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userDummy);
        expect(res.statusCode).toBe(200);
    });

    test('throws error when register user with same payload', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ email: 'manish@gmail.com', password: 'hello@123' });
        expect(res.statusCode).toBe(400);
    });

    test('throws error when registering user with invalid payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ ...userDummy, invalid: 'ss' });
        expect(res.statusCode).toBe(400);
        done();
    });

    test('login user with correct payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'manish@gmail.com', password: 'hello@123' });
        // updates authorization token
        authorizationToken = `Bearer ${res.body.data.token}`;
        expect(res.statusCode).toBe(200);
        done();
    });

    test('login user with incorrect payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'testing@mailinator.com',
                password: 'sdfs',
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe(NO_USER_FOUND);
        done();
    });

    test('login user with wrong credentials', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'manish@gmail.com', password: 'somepassword' });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe(INVALID_UNAME_PWORD);
        done();
    });

    test('get logged in user', async (done) => {
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error when no token provied', async (done) => {
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', '');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe(NO_TOKEN_PROVIDED);
        done();
    });

    test('throws error when token is expired', async (done) => {
        // eslint-disable-next-line no-multi-str
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', tokenExpired);
        expect(res.statusCode).toBe(401);
        done();
    });

    test('throws error when token is invalid', async (done) => {
        // eslint-disable-next-line no-multi-str
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', tokenInvalid);
        expect(res.statusCode).toBe(401);
        done();
    });
    /* auth endpoints end */

    /* users endpoints  start */
    test('get all users', async (done) => {
        const res = await request(app)
            .get('/api/v1/users');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toEqual(3);
        done();
    });

    test('get user by id', async (done) => {
        const res = await request(app)
            .get(`/api/v1/users/${userId}`);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error getting user which doesnt exist', async (done) => {
        const res = await request(app)
            .get('/api/v1/users/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error getting user with incorrect uuid', async (done) => {
        const res = await request(app)
            .get('/api/v1/users/1234')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });

    test('update user by id', async (done) => {
        const res = await request(app)
            .put(`/api/v1/users/${userId}`)
            .send({
                name: 'Manish New',
                email: 'manish@gmail.com',
                role: 'user',
                password: 'password@123',
                status: true,
            })
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error updating user which doesnt exist', async (done) => {
        const res = await request(app)
            .put('/api/v1/users/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error updating user with incorrect uuid', async (done) => {
        const res = await request(app)
            .put('/api/v1/users/1234')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });
});
