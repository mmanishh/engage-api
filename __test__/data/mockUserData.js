const crypto = require('crypto');

exports.mockUsersData = [
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
];

exports.mockCompaniesData = [
    {
        id: '01cf8688-b1a9-44fe-ada0-608505a0038b',
        name: 'Imar',
        phone: '089453655',
        website: 'http://www.imar.ie',
        createdAt: '2022-09-10T11:54:47.101Z',
        updatedAt: '2022-09-10T11:54:47.101Z',
    },
];

exports.mockEmployeesData = [
    {
        fullName: 'Manish Maharjan',
        id: 'aa6fff92-4cbb-4575-80be-1e6b954d279e',
        firstName: 'Manish',
        lastName: 'Maharjan',
        email: 'mmaharjann@gmail.com',
        phone: '0894053659',
        createdAt: '2022-09-10T09:00:03.540Z',
        updatedAt: '2022-09-10T09:00:03.540Z',
        CompanyId: '01cf8688-b1a9-44fe-ada0-608505a0038b',
        company: {
            id: '01cf8688-b1a9-44fe-ada0-608505a0038b',
            name: 'Facebook',
            phone: '089453655',
            website: 'http://www.facebook.ie',
            createdAt: '2022-09-10T09:00:03.513Z',
            updatedAt: '2022-09-10T11:56:52.424Z',
        },
    },
];
