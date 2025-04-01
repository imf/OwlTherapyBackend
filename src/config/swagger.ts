import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
// import glob from 'glob'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brighten API',
      version: '1.0.0',
      description: 'API documentation for Brighten Services',
    },
    components: {
      securitySchemes: {
        ChainLinkUserAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'chainlink UUID',
          description: 'Requires a valid ChainLink token for any logged-in user. Format: "Authorization: ChainLink <UUID token>"',
        },
        ChainLinkRoleAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'chainlink UUID',
          description: 'Requires a valid ChainLink token for any user with specified role. Format: "Authorization: ChainLink <UUID token>"',
        },
        ChainLinkAdminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'chainlink UUID',
          description: 'Requires a valid ChainLink token for any user with the "admin" role. Format: "Authorization: ChainLink <UUID token>"',
        },
      },
    },
    security: [
      { RequireUser: [] },
      { RequireRole: [] },
      { RequireAdmin: [] },
      { RequireAPIKey: [] },
    ], // Apply globally if needed
  },
  apis: [
    './src/routes/**/*.ts',
    './src/controllers/**/*.ts',
  ],
}

// console.debug('Swagger matched files:', glob.sync('./src/**/*.ts'))

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerUi, swaggerDocs }
