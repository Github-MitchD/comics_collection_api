const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { BASE_URL } = require('./config');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Comics Collection API',
            version: '1.0.0',
            description: 'This is the API documentation for the Comics Collection project. It provides endpoints for managing comics, authors, and user authentication. You can find the source code on [GitHub](https://github.com/Github-MitchD/comics_collection_api).',
            contact: {
                name: 'Michel Dufour',
                url: 'https://micheldufour.fr',
                email: 'contact@michel-dufour.fr',
                github: 'https://github.com/Github-MitchD'
            },
            license: {
                name: 'License MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: `${BASE_URL}`,
                description: 'Local server'
            },
            {
                url: 'https://comics_collection_api.micheldufour.fr',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                            description: 'User ID'
                        },
                        username: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Username of the user'
                        },
                        email: {
                            type: 'string',
                            example: 'johndoe@example.com',
                            description: 'Email of the user'
                        },
                        password: {
                            type: 'string',
                            example: 'password1234',
                            description: 'Password of the user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Creation date'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Last update date'
                        }
                    }
                },
                Comic: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            exemple: 1,
                            description: 'Comic ID'
                        },
                        title: {
                            type: 'string',
                            exemple: "Titre du Comic",
                            description: 'Comic title'
                        },
                        slug: {
                            type: 'string',
                            exemple: "titre-du-comic",
                            description: 'Comic slug'
                        },
                        frontCover: {
                            type: 'string',
                            example: 'https://example.com/front-cover.jpg',
                            description: 'URL of the front cover image'
                        },
                        backCover: {
                            type: 'string',
                            example: 'https://example.com/back-cover.jpg',
                            description: 'URL of the back cover image'
                        },
                        description: {
                            type: 'string',
                            example: 'Description du comic',
                            description: 'Description of the comic'
                        },
                        collection: {
                            type: 'string',
                            example: 'Collection du Comic',
                            description: 'Collection name'
                        },
                        tome: {
                            type: 'integer',
                            example: 1,
                            description: 'Tome number'
                        },
                        authorId: {
                            type: 'integer',
                            example: 1,
                            description: 'ID of the author'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Creation date'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Last update date'
                        },
                        deletedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Deletion date'
                        }
                    }
                },
                Author: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                            description: 'Author ID'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Name of the author'
                        },
                        slug: {
                            type: 'string',
                            example: 'john-doe',
                            description: 'Slug of the author'
                        },
                        image: {
                            type: 'string',
                            example: 'https://example.com/john-doe.jpg',
                            description: 'URL of the author\'s image'
                        },
                        birthdate: {
                            type: 'string',
                            example: '2023-01-01',
                            format: 'date-time',
                            description: 'Birthdate of the author'
                        },
                        bio: {
                            type: 'string',
                            example: 'Biography of John Doe',
                            description: 'Biography of the author'
                        },
                        website: {
                            type: 'string',
                            example: 'https://johndoe.com',
                            description: 'Website of the author'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Creation date'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Last update date'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                            description: 'User ID'
                        },
                        username: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Username of the user'
                        },
                        email: {
                            type: 'string',
                            example: 'johndoe@example.com',
                            description: 'Email of the user'
                        },
                        password: {
                            type: 'string',
                            example: 'password1234',
                            description: 'Password of the user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Creation date'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00Z',
                            description: 'Last update date'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
    swaggerOptions: {
      customSiteTitle: 'Comics Collection API Documentation'
    }
};