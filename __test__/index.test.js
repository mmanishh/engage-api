const request = require('supertest');
const {
    expect,
    describe,
    test,
    afterAll,
} = require('@jest/globals');

const conn = require('../src/config/sequelizeConnect');
const app = require('../src/app');

describe('index', () => {
    test('get the root path', async (done) => {
        const res = await request(app)
            .get('/');
        expect(res.statusCode).toBe(200);
        done();
    });

    test('get the health', async (done) => {
        const res = await request(app)
            .get('/health');
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error for incorrect route', async (done) => {
        const res = await request(app)
            .get('/ssdfh');
        expect(res.statusCode).toBe(500);
        done();
    });
});

afterAll(async (done) => {
    try {
        await conn.dbDisconnect();
        done();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
