const request = require('supertest');
const {
    expect,
    describe,
    test,
    afterAll,
    beforeAll,
} = require('@jest/globals');
const conn = require('../src/config/sequelize-connect');
const app = require('../src/app');
const { userDummy, userPass } = require('./data/userData');
const {
    DATA_ALREADY_EXIST, NO_TOKEN_PROVIDED, NO_USER_FOUND, DATA_DOES_NOT_EXIST,
} = require('../src/helpers/messages');

let userData;
let authorizationToken;

beforeAll(async () => {
    // checking DB connection
    try {
        await conn.dbConnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});

describe('user', () => {
    test('register user with correct payload', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userDummy);
        userData = res.body.data;
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBe(userData);
        done();
    });

    test('throws error when registering user which already exist', async (done) => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userDummy);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(DATA_ALREADY_EXIST);
        done();
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
            .send(userPass);
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
        const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ij \
    E3ZWNkYjkwLWRjOWItNGI2OC1iOGZiLWNhNGY3NTQ1ZWJjMCIsInJvbGUiOiJ1c2VyI \
    iwiaWF0IjoxNjYyNTU5MjU4LCJleHAiOjE2NjI1NTkyNTl9.vfij8G6hGsw5TLSC_vh\
    gcyCFdnvD2dfUaV7ct_93ySw';

        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', jwtToken);
        expect(res.statusCode).toBe(401);
        done();
    });

    test('throws error when token is invalid', async (done) => {
    // eslint-disable-next-line no-multi-str
        const jwtToken = 'eAAAAGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ij \
    E3ZWNkYjkwLWRjOWItNGI2OC1iOGZiLWNhNGY3NTQ1ZWJjMCIsInJvbGUiOiJ1c2VyI \
    iwiaWF0IjoxNjYyNTU5MjU4LCJleHAiOjE2NjI1NTkyNTl9.vfij8G6hGsw5TLSC_vh\
    gcyCFdnvD2dfUaV7ct_93ySw';

        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('authorization', jwtToken);
        expect(res.statusCode).toBe(401);
        done();
    });

    test('get all users', async (done) => {
        const res = await request(app)
            .get('/api/v1/users')
            .set('authorization', authorizationToken);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('get user by id', async (done) => {
        const res = await request(app)
            .get(`/api/v1/users/${userData.id}`)
            .set('authorization', authorizationToken);
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
            .put(`/api/v1/users/${userData.id}`)
            .send({
                name: 'New User',
                email: 'test@gmail.com',
                role: 'user',
                password: 'hello@123',
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

afterAll(async () => {
    try {
        await conn.dbDisconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
