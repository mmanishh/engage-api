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
