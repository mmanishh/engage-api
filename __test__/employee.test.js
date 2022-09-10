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
const { employeeDummy, employeeId } = require('./data/employeeData');
const { tokenValid } = require('./data/userData');

// Mock the overall database layer (connection etc..)
jest.mock('sequelize', () => require('./_mocks/sequelize'));

// Mock the employee model with some test data and add both model method overrides
// TODO : refactor in seperate file
jest.mock('../src/models/employee', () => () => {
    const SequelizeMock = require('sequelize-mock');

    const dbMock = new SequelizeMock();
    const employeeMock = dbMock.define('employee');

    const { mockEmployeesData } = require('./data/mockUserData');

    const employeeObject = employeeMock.build(mockEmployeesData[0]);

    employeeObject.update = (data) => {
        employeeObject.isUpdated = true;
        employeeObject.name = data.name;
        return Promise.resolve();
    };

    employeeObject.destroy = () => {
        employeeObject.isDestroyed = true;
        return Promise.resolve();
    };

    const testModelInstances = [
        employeeObject,
        employeeMock.build(mockEmployeesData[1]),
    ];

    // Mock model method overrides for tests below
    employeeMock.findAll = () => Promise.resolve(testModelInstances);
    employeeMock.findOne = ({ where }) => {
        if (!where) return;
        const { email } = where;
        if (!email) return;
        const employee = mockEmployeesData.find((e) => e.email === email);
        if (!employee) return;
        return Promise.resolve(employeeMock.build(employee));
    };

    employeeMock.findByPk = (id) => {
        const employee = mockEmployeesData.find((e) => e.id === id);
        if (!employee) return;
        return Promise.resolve(employeeMock.build(employee));
    };

    employeeMock.create = (data) => {
        testModelInstances.push(data);
        return Promise.resolve();
    };

    // Mock test helper methods
    employeeMock.mockHelperGetLastCreated = () => testModelInstances[testModelInstances.length - 1];
    employeeMock.mockHelperIsUpdateCalled = () => testModelInstances[0].isUpdated;
    employeeMock.mockHelperIsDestroyCalled = () => testModelInstances[0].isDestroyed;

    return employeeMock;
});

const ENDPOINT = '/api/v1/employees';

describe('employee', () => {
    /* employees endpoints  start */
    test('create employee with correct payload', async () => {
        const res = await request(app)
            .post(ENDPOINT)
            .send(employeeDummy)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
    });

    test('get all employees', async (done) => {
        const res = await request(app)
            .get(ENDPOINT)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toEqual(3);
        done();
    });

    test('get employee by id', async (done) => {
        const res = await request(app)
            .get(`${ENDPOINT}/${employeeId}`)
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error getting employee which doesnt exist', async (done) => {
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
        const res = await request(app)
            .put(`${ENDPOINT}/${employeeId}`)
            .send({
                firstName: 'Manish',
                lastName: 'Shrestha',
                email: 'mmaharjann@gmail.com',
                phone: '0894053659',
            })
            .set('authorization', tokenValid);
        expect(res.statusCode).toBe(200);
        done();
    });

    test('throws error updating employee which doesnt exist', async (done) => {
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
