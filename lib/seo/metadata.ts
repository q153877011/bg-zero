import type { Metadata } from 'next'
import { siteConfig } from './siteConfig'

type BuildArgs = {
  locale: string
  path: string
  title: string
  description: string
  ogImage?: string
  noindex?: boolean
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
  noindex,
}: BuildArgs): Metadata {
  const url =
    locale === siteConfig.defaultLocale
      ? `${siteConfig.domain}${path}`
      : `${siteConfig.domain}/${locale}${path}`

  const languages: Record<string, string> = {}
  for (const l of siteConfig.locales) {
    const langTag = l === 'en' ? 'en-US' : 'zh-CN'
    languages[langTag] =
      l === siteConfig.defaultLocale
        ? `${siteConfig.domain}${path}`
        : `${siteConfig.domain}/${l}${path}`
  }
  languages['x-default'] = `${siteConfig.domain}${path}`

  return {
    metadataBase: new URL(siteConfig.domain),
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage ?? siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage ?? siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
  }
}
