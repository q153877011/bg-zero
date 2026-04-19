/**
 * app/api/admin/events/route.ts
 * Paginated event list for admin event detail page.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/server/adminGuard'
import { usePool } from '@/lib/server/db'

export async function GET(request: Request) {
  const adminResult = await requireAdmin(request)
  if (adminResult instanceof NextResponse) return adminResult

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 50))
  const offset = (page - 1) * limit
  const eventFilter = searchParams.get('event') || undefined

  let whereClause = ''
  const params: any[] = [limit, offset]

  if (eventFilter) {
    whereClause = 'WHERE e.event = $3'
    params.push(eventFilter)
  }

  const pool = usePool()

  const [rows, total] = await Promise.all([
    pool.query(
      `SELECT e.id, e.event, e.metadata, e.created_at,
              u.name AS user_name, u.email AS user_email
       FROM public.analytics_events e
       LEFT JOIN public."user" u ON e.user_id = u.id
       ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    ),
    pool.query(
      `SELECT COUNT(*) AS count FROM public.analytics_events e ${whereClause}`,
      eventFilter ? [eventFilter] : []
    ),
  ])

  return NextResponse.json({
    events: rows.rows,
    pagination: {
      page,
      limit,
      total: Number(total.rows[0].count),
      totalPages: Math.ceil(Number(total.rows[0].count) / limit),
    },
  })
}
