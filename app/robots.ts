import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/siteConfig'
import { routing } from '@/i18n/routing'

/**
 * Commercial SEO crawlers (Ahrefs, SEMrush, Moz, etc.) can generate
 * thousands of requests per day that don't help our organic traffic.
 * Block them to reduce Vercel Edge Request spend.
 *
 * Google, Bing, DuckDuckGo are left alone — they drive real traffic.
 */
const BLOCKED_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'rogerbot',
  'BLEXBot',
  'DataForSeoBot',
  'PetalBot',
  'SeznamBot',
  'Barkrowler',
  'serpstatbot',
]

export default function robots(): MetadataRoute.Robots {
  const sensitiveRoutes = ['/admin', '/admin/*', '/login', '/register', '/forgot-password', '/reset-password']

  const disallowList = [
    '/api/*',
    ...sensitiveRoutes.flatMap(route =>
      routing.locales.map(locale =>
        locale === routing.defaultLocale ? route : `/${locale}${route}`
      )
    ),
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: disallowList,
        crawlDelay: 10,
      },
      ...BLOCKED_BOTS.map(bot => ({
        userAgent: bot,
        disallow: ['/'],
      })),
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  }
}
