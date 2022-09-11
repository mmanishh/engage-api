module.exports = {
    '/companies': {
        get: {
            tags: ['Company'],
            summary: 'Get All Company',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
            responses: {
                200: {
                    description: 'Get All Company',
                },
            },
        },
        post: {
            tags: ['Company'],
            summary: 'Create New Company',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
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
                                phone: {
                                    type: 'string',
                                },
                                website: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'name',
                            ],
                            example: {
                                name: 'Engage',
                                phone: '0894053659',
                                website: 'https://www.engage.ie',
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Created New Company',
                },
            },
        },
    },
    '/companies/{id}': {
        get: {
            tags: ['Company'],
            summary: 'Get Company By Id',
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
                    description: 'Company Id',
                },
            ],
            responses: {
                200: {
                    description: 'Get Company By Id',
                },
            },
        },
        put: {
            tags: ['Company'],
            summary: 'Update Company',
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
                    description: 'Company Id',
                },
            ],
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
                                phone: {
                                    type: 'string',
                                },
                                website: {
                                    type: 'string',
                                },
                            },
                            required: [],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Company Updated',
                },
            },
        },
    },
};
