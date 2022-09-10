/* eslint-disable no-multi-str */
const userPass = {
    email: 'test@gmail.com',
    password: 'hello@123',
};

exports.userPass = userPass;

exports.userDummy = {
    name: 'Test User',
    role: 'user',
    status: true,
    ...userPass,
};

exports.tokenExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ij \
    E3ZWNkYjkwLWRjOWItNGI2OC1iOGZiLWNhNGY3NTQ1ZWJjMCIsInJvbGUiOiJ1c2VyI \
    iwiaWF0IjoxNjYyNTU5MjU4LCJleHAiOjE2NjI1NTkyNTl9.vfij8G6hGsw5TLSC_vh\
    gcyCFdnvD2dfUaV7ct_93ySw';

exports.tokenInvalid = 'eAAAAGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ij \
    E3ZWNkYjkwLWRjOWItNGI2OC1iOGZiLWNhNGY3NTQ1ZWJjMCIsInJvbGUiOiJ1c2VyI \
    iwiaWF0IjoxNjYyNTU5MjU4LCJleHAiOjE2NjI1NTkyNTl9.vfij8G6hGsw5TLSC_vh\
    gcyCFdnvD2dfUaV7ct_93ySw';

exports.tokenValid = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3ZWNkYjkwLWRjOWItNGI2OC1iOGZiLWNhNGY3NTQ1ZWJjMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjYyODExODg0LCJleHAiOjE2NjM0MTY2ODR9.baQAB6_ttHOnVgtuIFel741-hIWnJegFA0nDVloKZLw';
