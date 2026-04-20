/**
 * app/api/analytics/route.ts
 * Batched event ingestion endpoint.
 *
 * Accepts { events: [{ event, metadata, ts }, ...] } up to 50 events per call.
 * Skips session lookup for unauthenticated requests (fast path — no DB query).
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { usePool } from '@/lib/server/db'

const ALLOWED_EVENTS = new Set([
  'image_upload', 'engine_switch',
  'process_start', 'process_done', 'process_error',
  'download', 'manual_remove', 'manual_mask',
  'sign_up', 'sign_in',
])

const MAX_EVENTS_PER_BATCH = 50
const MAX_METADATA_BYTES = 2048

interface IncomingEvent {
  event: string
  metadata?: Record<string, unknown>
  ts?: number
}

/**
 * Fast check: only look up the session if the request actually carries an
 * auth cookie. Most analytics traffic comes from anonymous users, and each
 * getSession() call hits Postgres — this alone cuts DB load by 60-80%.
 */
function hasAuthCookie(headers: Headers): boolean {
  const cookie = headers.get('cookie') ?? ''
  // better-auth default cookie name prefix
  return cookie.includes('better-auth.session_token') ||
    cookie.includes('__Secure-better-auth.session_token')
}

export async function POST(request: Request) {
  let body: { events?: IncomingEvent[]; event?: string; metadata?: unknown }
  try {
    // sendBeacon posts as Blob; both JSON.parse paths work
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Normalize: support both legacy single-event shape and new batched shape
  const incoming: IncomingEvent[] = Array.isArray(body?.events)
    ? body.events
    : body?.event
      ? [{ event: body.event, metadata: (body.metadata as Record<string, unknown>) ?? {} }]
      : []

  if (incoming.length === 0) {
    return NextResponse.json({ error: 'No events' }, { status: 400 })
  }

  if (incoming.length > MAX_EVENTS_PER_BATCH) {
    return NextResponse.json({ error: 'Too many events' }, { status: 400 })
  }

  // Validate + stringify metadata upfront to fail fast
  const rows: Array<[string, string]> = []
  for (const e of incoming) {
    if (!e?.event || !ALLOWED_EVENTS.has(e.event)) {
      return NextResponse.json({ error: `Invalid event: ${e?.event}` }, { status: 400 })
    }
    const metadataStr = JSON.stringify(e.metadata ?? {})
    if (metadataStr.length > MAX_METADATA_BYTES) {
      return NextResponse.json({ error: 'Metadata too large' }, { status: 400 })
    }
    rows.push([e.event, metadataStr])
  }

  // Fast path for anonymous users — skip DB session lookup entirely
  let userId: string | null = null
  if (hasAuthCookie(request.headers)) {
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      userId = session?.user?.id ?? null
    } catch {
      // Ignore — analytics shouldn't fail on auth issues
    }
  }

  const pool = usePool()

  // Batch insert with one SQL round-trip (parameterized values)
  // $1 = userId (same for all rows), then pairs: ($2, $3), ($4, $5), ...
  const valuesSql = rows.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')
  const params: Array<string | null> = [userId]
  for (const [ev, md] of rows) params.push(ev, md)

  await pool.query(
    `INSERT INTO public.analytics_events (user_id, event, metadata) VALUES ${valuesSql}`,
    params,
  )

  return NextResponse.json({ ok: true, count: rows.length })
}
