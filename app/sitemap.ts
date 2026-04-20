import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/auto', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/manual', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/compare/remove-bg-alternative', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/use-cases/ecommerce', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/use-cases/profile-picture', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/licenses', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/accessibility', priority: 0.3, changeFrequency: 'monthly' as const },
  ]
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const { path: p, priority, changeFrequency } of paths) {
    entries.push({
      url: `${siteConfig.domain}${p}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'en-US': `${siteConfig.domain}${p}`,
          'zh-CN': `${siteConfig.domain}/zh${p === '/' ? '' : p}`,
        },
      },
    })
  }

  return entries
}
