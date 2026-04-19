/**
 * app/api/admin/stats/route.ts
 * Aggregated analytics for admin dashboard.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/server/adminGuard'
import { usePool } from '@/lib/server/db'

export async function GET(request: Request) {
  const adminResult = await requireAdmin(request)
  if (adminResult instanceof NextResponse) return adminResult

  const { searchParams } = new URL(request.url)
  const days = Math.min(365, Math.max(1, Number(searchParams.get('days')) || 30))

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString()

  const pool = usePool()

  const [
    totalUsers,
    newUsersInPeriod,
    eventCounts,
    engineUsage,
    dailyProcessing,
    topPages,
    errorRate,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS count FROM public."user"`),
    pool.query(
      `SELECT COUNT(*) AS count FROM public."user" WHERE "createdAt" >= $1`,
      [sinceStr]
    ),
    pool.query(
      `SELECT event, COUNT(*) AS count
       FROM public.analytics_events
       WHERE created_at >= $1
       GROUP BY event ORDER BY count DESC`,
      [sinceStr]
    ),
    pool.query(
      `SELECT metadata->>'engine' AS engine, COUNT(*) AS count
       FROM public.analytics_events
       WHERE event = 'process_done' AND created_at >= $1
       GROUP BY engine ORDER BY count DESC`,
      [sinceStr]
    ),
    pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM public.analytics_events
       WHERE event IN ('process_done', 'process_error') AND created_at >= $1
       GROUP BY DATE(created_at) ORDER BY date`,
      [sinceStr]
    ),
    pool.query(
      `SELECT metadata->>'page' AS page, COUNT(*) AS count
       FROM public.analytics_events
       WHERE event = 'page_view' AND created_at >= $1
       GROUP BY page ORDER BY count DESC LIMIT 10`,
      [sinceStr]
    ),
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE event = 'process_done') AS success,
         COUNT(*) FILTER (WHERE event = 'process_error') AS errors
       FROM public.analytics_events
       WHERE event IN ('process_done', 'process_error') AND created_at >= $1`,
      [sinceStr]
    ),
  ])

  return NextResponse.json({
    period: { days, since: sinceStr },
    overview: {
      totalUsers: Number(totalUsers.rows[0].count),
      newUsers: Number(newUsersInPeriod.rows[0].count),
      successCount: Number(errorRate.rows[0]?.success || 0),
      errorCount: Number(errorRate.rows[0]?.errors || 0),
    },
    eventCounts: eventCounts.rows,
    engineUsage: engineUsage.rows,
    dailyProcessing: dailyProcessing.rows,
    topPages: topPages.rows,
  })
}
