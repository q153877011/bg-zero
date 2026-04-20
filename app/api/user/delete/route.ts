/**
 * app/api/user/delete/route.ts
 * Account deletion endpoint — GDPR Art. 17 (Right to Erasure)
 * Deletes all user data and anonymizes analytics events.
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { usePool } from '@/lib/server/db'

export async function POST(request: Request) {
  // Authenticate the user
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const userEmail = session.user.email
  const pool = usePool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Delete verification tokens
    if (userEmail) {
      await client.query(
        'DELETE FROM verification WHERE identifier = $1',
        [userEmail]
      )
    }

    // Delete OAuth accounts
    await client.query(
      'DELETE FROM account WHERE "userId" = $1',
      [userId]
    )

    // Delete all sessions
    await client.query(
      'DELETE FROM session WHERE "userId" = $1',
      [userId]
    )

    // Anonymize analytics events (preserve aggregate data, strip PII)
    await client.query(
      'UPDATE analytics_events SET user_id = NULL WHERE user_id = $1',
      [userId]
    )

    // Delete user record
    await client.query(
      'DELETE FROM "user" WHERE id = $1',
      [userId]
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[User Delete] Transaction failed:', (err as Error).message)
    return NextResponse.json(
      { error: 'Deletion failed, please try again' },
      { status: 500 }
    )
  } finally {
    client.release()
  }

  return NextResponse.json({ ok: true, message: 'Account deleted successfully' })
}
