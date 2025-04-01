import cors from 'cors'

// If in development mode, allow localhost and IPv6 localhost
// If in production, allow only epicenter.is, epicenterhq.net, and epicenterhq.org
const local_origins = [/localhost:\d+$/, /\[::1\]:\d+$/]

const inDevMode = process.env.NODE_ENV === 'development' || true

const allowedOrigins = [
  /\.seedling\.it$/,
  ...local_origins.map((origin) => new RegExp(origin)).filter(() => inDevMode),
]

export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  },
  exposedHeaders: [
    'X-Next-ChainLink-Token', 
    'X-Trace-Id'
  ],
}

console.debug(`CORS allowed origins: ${allowedOrigins}`)
