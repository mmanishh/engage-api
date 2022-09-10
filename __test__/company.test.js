/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest');
const {
    expect,
    describe,
    afterAll,
} = require('@jest/globals');
const app = require('../src/app');
const {
    DATA_DOES_NOT_EXIST,
} = require('../src/helpers/messages');
const { companyDummy, companyId } = require('./data/companyData');
const { tokenValid } = require('./data/userData');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));

// Mock the company model with some test data and add both model method overrides
// TODO : refactor in seperate file
jest.mock('../src/models/company', () => () => {
    const SequelizeMock = require('sequelize-mock');

    const dbMock = new SequelizeMock();
    const companyMockModel = dbMock.define('company');

    const { mockCompaniesData } = require('./data/mockUserData');

    const companyObject = companyMockModel.build(mockCompaniesData[0]);

    companyObject.update = (data) => {
        companyObject.isUpdated = true;
        companyObject.name = data.name;
        return Promise.resolve();
    };

    companyObject.destroy = () => {
        companyObject.isDestroyed = true;
        return Promise.resolve();
    };

    const testModelInstances = [
        companyObject,
        companyMockModel.build(mockCompaniesData[1]),
    ];

    // Mock model method overrides for tests below
    companyMockModel.findAll = () => Promise.resolve(testModelInstances);
    companyMockModel.findOne = ({ where }) => {
        if (!where) return;
        const { email } = where;
        if (!email) return;
        const company = mockCompaniesData.find((e) => e.email === email);
        if (!company) return;
        return Promise.resolve(companyMockModel.build(company));
    };
    // companyMockModel.findByPk = (query) => () => Promise.resolve(testModelInstances[0]);
    companyMockModel.findByPk = (id) => {
        const company = mockCompaniesData.find((e) => e.id === id);
        if (!company) return;
        return Promise.resolve(companyMockModel.build(company));
    };

    companyMockModel.create = (data) => {
        testModelInstances.push(data);
        return Promise.resolve();
    };

    // Mock test helper methods
    companyMockModel.mockHelperGetLastCreated = () => testModelInstances[testModelInstances.length - 1];
    companyMockModel.mockHelperIsUpdateCalled = () => testModelInstances[0].isUpdated;
    companyMockModel.mockHelperIsDestroyCalled = () => testModelInstances[0].isDestroyed;

    return companyMockModel;
});

const ENDPOINT = '/api/v1/companies';

describe('company', () => {
    /* companies endpoints  start */
    test('create company with correct payload', async () => {
        const res = await request(app)
            .post(ENDPOINT)
            .send(companyDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
    });

    test('get all companies', async (done) => {
        const res = await request(app)
            .get(ENDPOINT)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toEqual(3);
        done();
    });

    test('get company by id', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/${companyId}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error getting company which doesnt exist', async (done) => {
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
        const res = await request(app)
            .put(`${ENDPOINT}/${companyId}`)
            .send({
                name: 'Facebook',
                email: 'hello@gmail.com',
                phone: '089453655',
                website: 'http://www.imar.ie',
            })
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error updating company which doesnt exist', async (done) => {
        const res = await request(app)
            .put(`${ENDPOINT}/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error updating company with incorrect uuid', async (done) => {
        const res = await request(app)
            .put(`${ENDPOINT}/1234`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });
});

afterAll(async () => {
    jest.clearAllMocks();
});
