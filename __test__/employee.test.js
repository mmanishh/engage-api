/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest');
const {
    expect,
    describe,
    afterAll,
    beforeAll,
} = require('@jest/globals');
const SequelizeMock = require('sequelize-mock');
const app = require('../src/app');
const {
    DATA_DOES_NOT_EXIST,
} = require('../src/helpers/messages');
const { mockEmployeesData, mockUsersData } = require('./data/mockData');
const { employeeDummy } = require('./data/employee');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));
jest.mock('../src/models');

const { Employee, User } = require('../src/models');

const ENDPOINT = '/api/v1/employees';
const employeeId = mockEmployeesData[0].id;
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

    Employee.findByPk = jest.fn();
    Employee.findAll.mockResolvedValue(mockEmployeesData);
    Employee.create.mockResolvedValue(employeeMock.build(mockEmployeesData[0]));
    Employee.findByPk.mockResolvedValue(employeeMock.build(mockEmployeesData[0]));
    Employee.findOne.mockResolvedValue(userMock.build(mockEmployeesData[0]));

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

describe('employee', () => {
    /* employees endpoints  start */
    test('create employee with correct payload', async () => {
        const res = await request(app)
            .post(ENDPOINT)
            .send(employeeDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockEmployeesData[0]);
    });

    test('get all employees', async (done) => {
        const res = await request(app)
            .get(ENDPOINT)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockEmployeesData);
        done();
    });

    test('get employee by id', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/${employeeId}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(mockEmployeesData[0]);
        done();
    });

    test('throws error getting employee which doesnt exist', async (done) => {
        Employee.findByPk.mockResolvedValueOnce(null);

        const res = await request(app)
            .get(`${ENDPOINT}/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error getting employee with incorrect uuid', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/1234`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('"id" must be a valid GUID');
        done();
    });

    test('update employee by id', async (done) => {
        Employee.update.mockResolvedValue(mockEmployeesData[0]);
        const payload = {
            email: 'manish@gmail.com',
            phone: '0556666',
        };

        const res = await request(app)
            .put(`${ENDPOINT}/${employeeId}`)
            .send(payload)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);

        const updated = mockEmployeesData[0];
        updated.email = payload.email;
        updated.phone = payload.phone;

        expect(res.body.data).toEqual(updated);
        done();
    });

    test('throws error updating employee which doesnt exist', async (done) => {
        Employee.findByPk.mockResolvedValueOnce(null);

        const res = await request(app)
            .put(`${ENDPOINT}/17ecdb90-dc9b-4b68-b8fb-ca4f7545ebaA`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(DATA_DOES_NOT_EXIST);
        done();
    });

    test('throws error updating employee with incorrect uuid', async (done) => {
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
