import type { Knex } from 'knex';
import './src/config/env';

type Environment = 'development' | 'test' | 'production' | 'playground';

const getConfig = (env: Environment): Knex.Config => ({
  client: 'pg', // Change client to PostgreSQL
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Default PostgreSQL port
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(env === 'production' ? { ssl: { rejectUnauthorized: true } } : {}), // No SSL for dev/test 
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
  pool: {
    min: 2,
    max: 10, // Adjust as needed
  },
});

export default {
  development: getConfig('development'),
  test: getConfig('test'),
  production: getConfig('production'),
} as const;
