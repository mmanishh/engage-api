module.exports = {
    '/users': {
        get: {
            tags: ['User'],
            summary: 'Get All User',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
            responses: {
                200: {
                    description: 'Get All User',
                },
            },
        },
    },
    '/users/{id}': {
        get: {
            tags: ['User'],
            summary: 'Get User By Id',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User Id',
                },
            ],
            responses: {
                200: {
                    description: 'Get User By Id',
                },
            },
        },
    },
};
