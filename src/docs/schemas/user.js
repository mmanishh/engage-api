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
            parameters: [
                {
                    $ref: '#/components/parameters/page',
                },
                {
                    $ref: '#/components/parameters/pageSize',
                },
                {
                    $ref: '#/components/parameters/filtered',
                },
                {
                    $ref: '#/components/parameters/sorted',
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
