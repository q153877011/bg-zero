import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/siteConfig'
import { routing } from '@/i18n/routing'

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
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  }
}
