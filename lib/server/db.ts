/**
 * lib/server/db.ts
 * Shared database connection pool for server API routes.
 */
import { Pool } from 'pg'

let _pool: Pool | null = null

export function usePool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DB_POOL_MAX) || 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  }
  return _pool
}
