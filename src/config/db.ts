import Knex from 'knex'
import { Model } from 'objection'
const knexConfigContainer = require('../../knexfile')

const knexConfig = knexConfigContainer.default
const environment = process.env.NODE_ENV || 'development'

// Ensure the environment is valid in knexfile
if (!knexConfig[environment]) {
  throw new Error(
    `Invalid NODE_ENV: ${environment}. Expected one of ${Object.keys(knexConfig).join(', ')}`,
  )
}

// Initialize Knex with the PostgreSQL configuration
const knexInstance = Knex(knexConfig[environment])

// Bind the Knex instance to Objection.js models
Model.knex(knexInstance)

export default knexInstance
