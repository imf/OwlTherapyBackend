import dotenv from 'dotenv'
import { getUrl } from '../utils/urlUtils'
dotenv.config()

const config = {
  apiUrl: getUrl() ?? 'http://localhost:4263/',
  environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
}

export default config
