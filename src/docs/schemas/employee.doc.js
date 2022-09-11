module.exports = {
    '/employees': {
        get: {
            tags: ['Employee'],
            summary: 'Get All Employee',
            produces: ['application/json'],
            security: [
                {
                    auth_token: [],
                },
            ],
            responses: {
                200: {
                    description: 'Get All Employee',
                },
            },
        },
        post: {
            tags: ['Employee'],
            summary: 'Create New Employee',
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
                                firstName: {
                                    type: 'string',
                                },
                                lastName: {
                                    type: 'string',
                                },
                                email: {
                                    type: 'string',
                                },
                                phone: {
                                    type: 'string',
                                },
                                company: {
                                    type: 'object',
                                    properties: {
                                        name: {
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
                                        website: 'https://www.engage.ie'
                                    },
                                },
                            },
                            required: [
                                'firstName',
                                'lastName',
                                'company',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Created New Employee',
                },
            },
        },
    },
    '/employees/{id}': {
        get: {
            tags: ['Employee'],
            summary: 'Get Employee By Id',
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
                    description: 'Employee Id',
                },
            ],
            responses: {
                200: {
                    description: 'Get Employee By Id',
                },
            },
        },
        put: {
            tags: ['Employee'],
            summary: 'Update Employee',
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
                    description: 'Employee Id',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                },
                                lastName: {
                                    type: 'string',
                                },
                                email: {
                                    type: 'string',
                                },
                                phone: {
                                    type: 'string',
                                },
                                company: {
                                    type: 'json',
                                },
                            },
                            required: [],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Employee Updated',
                },
            },
        },
    },
};
