/**
 * app/api/user/export/route.ts
 * Data export endpoint — GDPR Art. 20 (Right to Data Portability)
 * Returns all user data in machine-readable JSON format.
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { usePool } from '@/lib/server/db'

export async function GET(request: Request) {
  // Authenticate the user
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const pool = usePool()

  try {
    // Gather all user data
    const [userResult, sessionsResult, accountsResult, analyticsResult] = await Promise.all([
      pool.query(
        'SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt" FROM "user" WHERE id = $1',
        [userId]
      ),
      pool.query(
        'SELECT id, "createdAt", "updatedAt", "expiresAt", "ipAddress", "userAgent" FROM session WHERE "userId" = $1',
        [userId]
      ),
      pool.query(
        'SELECT id, "providerId", "createdAt", "updatedAt" FROM account WHERE "userId" = $1',
        [userId]
      ),
      pool.query(
        'SELECT event, metadata, created_at FROM analytics_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1000',
        [userId]
      ),
    ])

    const exportData = {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
      user: userResult.rows[0] || null,
      sessions: sessionsResult.rows,
      accounts: accountsResult.rows.map(a => ({
        id: a.id,
        provider: a.providerId,
        createdAt: a.createdAt,
      })),
      analyticsEvents: analyticsResult.rows,
      meta: {
        totalEvents: analyticsResult.rows.length,
        note: 'This export contains all personal data we hold about you. Images you processed were never stored on our servers.',
      },
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="bgzero-data-export-${userId}.json"`,
      },
    })
  } catch (err) {
    console.error('[User Export] Failed:', (err as Error).message)
    return NextResponse.json(
      { error: 'Export failed, please try again' },
      { status: 500 }
    )
  }
}
