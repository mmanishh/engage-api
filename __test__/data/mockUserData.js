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