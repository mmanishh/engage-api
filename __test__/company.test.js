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
    DATA_DOES_NOT_EXIST, SOMETHING_WENT_WRONG,
} = require('../src/helpers/messages');
const { companyDummy } = require('./data/company');
const { mockCompaniesData, mockUsersData } = require('./data/mockData');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));
jest.mock('../src/models');

const { Company, User } = require('../src/models');

const ENDPOINT = '/api/v1/companies';
const companyId = mockCompaniesData[0].id;
let tokenValid;

beforeAll(async (done) => {
    const dbMock = new SequelizeMock();
    const userMock = dbMock.define('user');

    User.findByPk = jest.fn();
    User.findAll.mockResolvedValue(mockUsersData);
    User.create.mockResolvedValue(userMock.build(mockUsersData[0]));
    User.findByPk.mockResolvedValue(userMock.build(mockUsersData[0]));
    User.findOne.mockResolvedValue(userMock.build(mockUsersData[0]));

    const employeeMock = dbMock.define('employee');

    Company.findByPk = jest.fn();
    Company.findAll.mockResolvedValue(mockCompaniesData);
    Company.create.mockResolvedValue(employeeMock.build(mockCompaniesData[0]));
    Company.findByPk.mockResolvedValue(employeeMock.build(mockCompaniesData[0]));
    Company.findOne.mockResolvedValue(userMock.build(mockCompaniesData[0]));

    // getting token by logging in
    try {
        User.findOne.mockResolvedValue(userMock.build(mockUsersData[0]));
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'manish@gmail.com', password: 'hello@123' });
        // updates authorization token
        tokenValid = `Bearer ${res.body.data.token}`;
        done();
    } catch (error) {
        process.exit(1);
    }
});

describe('company', () => {
    /* companies endpoints  start */

    test('create company with correct payload', async (done) => {
        const res = await request(app)
            .post(ENDPOINT)
            .send(companyDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockCompaniesData[0]);
        done();
    });

    test('get all companies', async (done) => {
        const res = await request(app)
            .get(ENDPOINT)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockCompaniesData);
        done();
    });

    test('get company by id', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/${companyId}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockCompaniesData[0]);
        done();
    });

    test('throws error getting company which doesnt exist', async (done) => {
        Company.findByPk.mockResolvedValueOnce(null);

        const res = await request(app)
            .get(`${ENDPOINT}/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error getting company with incorrect uuid', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/1234`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });

    test('update company by id', async (done) => {
        Company.update.mockResolvedValue(mockCompaniesData[0]);
        const payload = {
            name: 'Facebook',
            phone: '089453655',
            website: 'http://www.imar.ie',
        };

        const res = await request(app)
            .patch(`${ENDPOINT}/${companyId}`)
            .send(payload)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        const updated = mockCompaniesData[0];
        updated.name = payload.name;
        expect(res.body.data).toEqual(updated);
        done();
    });

    test('throws error updating company which doesnt exist', async (done) => {
        Company.findByPk.mockResolvedValueOnce(null);

        const res = await request(app)
            .patch(`${ENDPOINT}/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error updating company with incorrect uuid', async (done) => {
        const res = await request(app)
            .patch(`${ENDPOINT}/1234`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });

    test('throws error when creating company', async (done) => {
        Company.create.mockRejectedValueOnce(new Error());

        const res = await request(app)
            .post(`${ENDPOINT}`)
            .send(companyDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(500);
        done();
    });

    test('throws error when getting all', async (done) => {
        Company.findAll.mockRejectedValueOnce(new Error());

        const res = await request(app)
            .get(`${ENDPOINT}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(500);
        done();
    });

    test('throws error when geting company by id', async (done) => {
        Company.findByPk.mockRejectedValueOnce(new Error());

        const res = await request(app)
            .get(`${ENDPOINT}/${companyId}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(500);
        done();
    });

    test('throws error when updating company by id', async (done) => {
        Company.update.mockRejectedValueOnce(new Error());
        Company.findByPk.mockRejectedValueOnce(new Error());

        const res = await request(app)
            .patch(`${ENDPOINT}/${companyId}`)
            .send(companyDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(500);
        done();
    });
});

afterAll(async () => {
    jest.clearAllMocks();
});
