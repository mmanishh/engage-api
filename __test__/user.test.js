/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest');
const {
    expect,
    describe,
    afterAll,
} = require('@jest/globals');
const SequelizeMock = require('sequelize-mock');
const app = require('../src/app');
const {
    NO_TOKEN_PROVIDED, NO_USER_FOUND, DATA_DOES_NOT_EXIST, INVALID_UNAME_PWORD, DATA_ALREADY_EXIST,
} = require('../src/helpers/messages');
const { userDummy, tokenExpired, tokenInvalid } = require('./data/user');
const { mockUsersData } = require('./data/mockUserData');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));
jest.mock('../src/models');

const { User } = require('../src/models');

let authorizationToken;
const userId = mockUsersData[0].id;
const dbMock = new SequelizeMock();
const userMock = dbMock.define('user');

beforeAll(async (done) => {
    User.findByPk = jest.fn();
    User.findAll.mockResolvedValue(mockUsersData);
    User.create.mockResolvedValue(userMock.build(mockUsersData[0]));
    User.findOne.mockResolvedValue(userMock.build(mockUsersData[0]));
    User.findByPk = (id) => {
        const user = mockUsersData.find((e) => e.id === id);
        if (!user) return;
        return Promise.resolve(userMock.build(user));
    };
    // getting token by logging in
    try {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'manish@gmail.com', password: 'hello@123' });
        // updates authorization token
        authorizationToken = `Bearer ${res.body.data.token}`;
        done();
    } catch (error) {
        process.exit(1);
    }
});

afterAll(async () => {
    jest.clearAllMocks();
});

describe('user', () => {
    /* auth endpoints start */

    test('register user with correct payload', async () => {
        User.findOne.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userDummy);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('status');
        expect(res.body.data).toHaveProperty('role');
        expect(res.body.data).toHaveProperty('createdAt');
        expect(res.body.data).toHaveProperty('updatedAt');
    });

    test('throws error when register user with same payload', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userDummy);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(DATA_ALREADY_EXIST);
    });

    test('throws error when registering user with invalid payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ ...userDummy, invalid: 'ss' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"invalid" is not allowed');
        done();
    });

    test('login user with correct payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'manish@gmail.com', password: 'hello@123' });
        // updates authorization token
        authorizationToken = `Bearer ${res.body.data.token}`;
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data).toHaveProperty('user');
        done();
    });

    test('login user with incorrect payload', async (done) => {
        User.findOne.mockResolvedValueOnce(null);

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
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', tokenExpired);
        expect(res.statusCode).toBe(401);
        done();
    });

    test('throws error when token is invalid', async (done) => {
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
            .get('/api/v1/users')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockUsersData);
        done();
    });

    test('get user by id', async (done) => {
        const res = await request(app)
            .get(`/api/v1/users/${userId}`)
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockUsersData[0]);
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
        User.update.mockResolvedValue(mockUsersData[0]);

        const payload = {
            name: 'Manish New',
        };
        const res = await request(app)
            .put(`/api/v1/users/${userId}`)
            .send(payload)
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);

        const updated = JSON.parse(JSON.stringify(mockUsersData[0]));
        updated.name = payload.name;

        expect(res.body.data).toEqual(updated);

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
