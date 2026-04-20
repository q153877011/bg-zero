import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/**
 * Skip locale negotiation for RSC prefetch / payload requests.
 * These are internal Next.js navigation fetches that don't need cookie /
 * Accept-Language inspection, and account for a large portion of Edge
 * Middleware invocations on a busy site.
 */
export default function middleware(req: NextRequest) {
  const isRsc =
    req.headers.get('RSC') === '1' ||
    req.headers.get('Next-Router-Prefetch') === '1' ||
    req.nextUrl.searchParams.has('_rsc')

  if (isRsc) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
