module.exports = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Create New User',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                },
                                email: {
                                    type: 'string',
                                },
                                password: {
                                    type: 'string',
                                },
                                role: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'name',
                                'email',
                                'password',
                                'role',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Created New User',
                },
            },
        },
    },
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Login Your User',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                },
                                password: {
                                    type: 'string',
                                },
                            },
                            required: ['email', 'password'],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login Your User',
                },
            },
        },
    },
    '/auth/profile': {
        get: {
            tags: ['Auth'],
            summary: 'Get authenticated user',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
            responses: {
                200: {
                    description: 'Get authenticated user',
                },
            },
        },
    },
};
