import { config } from 'dotenv'
config()

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const PORT = process.env.PORT
export const PG_HOST = process.env.PG_HOST
export const PG_PORT = process.env.PG_PORT
export const PG_USER = process.env.PG_USER
export const PG_PASSWORD = process.env.PG_PASSWORD
export const PG_DATABASE = NODE_ENV === 'test' ? process.env.PG_DATABASE_TEST : process.env.PG_DATABASE