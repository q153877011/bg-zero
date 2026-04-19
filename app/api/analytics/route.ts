/**
 * app/api/analytics/route.ts
 * Event ingestion endpoint
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { usePool } from '@/lib/server/db'

const ALLOWED_EVENTS = new Set([
  'page_view', 'image_upload', 'engine_switch',
  'process_start', 'process_done', 'process_error',
  'download', 'manual_remove', 'manual_mask',
  'sign_up', 'sign_in',
])

export async function POST(request: Request) {
  const body = await request.json()

  if (!body?.event || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  }

  let userId: string | null = null
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    userId = session?.user?.id || null
  } catch {
    // No session — that's fine
  }

  const pool = usePool()
  await pool.query(
    `INSERT INTO public.analytics_events (user_id, event, metadata)
     VALUES ($1, $2, $3)`,
    [userId, body.event, JSON.stringify(body.metadata || {})]
  )

  return NextResponse.json({ ok: true })
}
