/**
 * lib/server/adminGuard.ts
 * Admin authentication guard — verifies user is a Super Admin.
 */
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminEmails = (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return session
}
