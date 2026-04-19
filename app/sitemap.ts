import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/auto', '/manual']
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const p of paths) {
    entries.push({
      url: `${siteConfig.domain}${p}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: p === '/' ? 1.0 : 0.8,
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
