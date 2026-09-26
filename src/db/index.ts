import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://fest_admin:fest_password@127.0.0.1:5433/fest_db',
})

export const db = drizzle(pool, { schema })
