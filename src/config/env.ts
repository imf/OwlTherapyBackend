import dotenv from 'dotenv'
import { redact } from '../utils/redactionUtils'

// Determine which .env file to load
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

// Load environment variables from the appropriate file
const configuration = dotenv.config({ path: envFile })

if (configuration.error) {
  console.error(`Error loading ${envFile}:`, configuration.error)
  process.exit(1)
}

var adminUsers: string[] = []
// Load ADMIN_USER_ID and split it on commas into an array of IDs
if (process.env.ADMIN_USER_ID) {
  adminUsers = process.env.ADMIN_USER_ID.split(',')
  console.debug(`Set ADMIN_USER_ID=${redact(process.env.ADMIN_USER_ID)}`)
}

const constructedBaseUrl = process.env.API_HOST
  ? `https://${process.env.API_HOST}`
  : undefined
export const baseUrl =
  process.env.API_URL || constructedBaseUrl || 'http://localhost:3000'
const llmConfig = process.env.LLM_KEYS || '{}'
export const llmKeys = JSON.parse(llmConfig)

export const adminUserIds = adminUsers // Get rid of this.

export const baseApiKey = process.env.BASE_API_KEY || ''

export const adminKey = process.env.ADMIN_KEY || null

export const PEPPER =
  process.env.PEPPER || 'default-aeadf384ec1496d82f9'

// Overwrite process.env variables with those from the .env file
if (configuration.parsed) {
  for (const [key, value] of Object.entries(configuration.parsed)) {
    process.env[key] = value
  }
  process.env['HOST'] = process.env['HOST'] || 'localhost'
  process.env['PORT'] = process.env['PORT'] || '3000'
  console.debug(`Environment variables from ${envFile} applied to process.env.`)
}

export default configuration.parsed || {}
