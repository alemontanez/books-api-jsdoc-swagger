import { Pool } from 'pg'
import {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE
} from './config'


const pool = new Pool({
  host: PG_HOST,
  port: Number(PG_PORT),
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
})

export default pool
