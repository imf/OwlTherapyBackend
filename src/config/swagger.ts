import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
// import glob from 'glob'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aurora API',
      version: '1.0.0',
      description: 'API documentation for Aurora Services',
    },
    // servers: [
    //   {
    //     url: 'https://api.gamelife.com',
    //     description: 'Production server',
    //   },
    //   {
    //     url: 'http://127.0.0.1:4263',
    //     description: 'Development Server',
    //   },
    //   {
    //     url: 'http://[::1]:4263',
    //     description: 'Development Server IPv6',
    //   },
    // ],
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
        // RequireUser: {
        //   type: 'apiKey',
        //   in: 'header',
        //   name: 'X-API-Key',
        // },
        // RequireRole: {
        //   type: 'apiKey',
        //   in: 'header',
        //   name: 'X-API-Key',
        // },
        // RequireAdmin: {
        //   type: 'apiKey',
        //   in: 'header',
        //   name: 'X-API-Key',
        // },
        // RequireAPIKey: {
        //   type: 'apiKey',
        //   in: 'header',
        //   name: 'X-API-Key',
        // },
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
