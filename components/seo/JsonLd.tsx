import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/lib/seo/siteConfig'
import { FAQ_KEYS } from '@/lib/constants/faq'

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027')
}

export async function HomeJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'auto' })
  const tf = await getTranslations({ locale, namespace: 'faq' })

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: siteConfig.name,
        url: siteConfig.domain,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any (Web Browser)',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          t('featureList1'), t('featureList2'), t('featureList3'),
          t('featureList4'), t('featureList5'), t('featureList6'),
        ],
      },
      {
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.domain,
        inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_KEYS.map((key) => ({
          '@type': 'Question',
          name: tf(`${key}.question`),
          acceptedAnswer: {
            '@type': 'Answer',
            text: tf(`${key}.answer`),
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}

export async function ToolPageJsonLd({
  locale,
  faqKeys,
  toolName,
  toolDescription,
  toolUrl,
}: {
  locale: string
  faqKeys: readonly string[]
  toolName: string
  toolDescription: string
  toolUrl: string
}) {
  const tf = await getTranslations({ locale, namespace: 'faq' })

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: toolName,
        url: toolUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any (Web Browser)',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: toolDescription,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqKeys.map((key) => ({
          '@type': 'Question',
          name: tf(`${key}.question`),
          acceptedAnswer: {
            '@type': 'Answer',
            text: tf(`${key}.answer`),
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}

export async function ArticleJsonLd({
  locale,
  title,
  description,
  url,
  datePublished,
  dateModified,
  faqKeys,
}: {
  locale: string
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  faqKeys?: readonly string[]
}) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: title,
      description,
      url,
      datePublished,
      dateModified,
      author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.domain },
      publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.domain },
      inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    },
  ]

  if (faqKeys && faqKeys.length > 0) {
    const tf = await getTranslations({ locale, namespace: 'faq' })
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqKeys.map((key) => ({
        '@type': 'Question',
        name: tf(`${key}.question`),
        acceptedAnswer: { '@type': 'Answer', text: tf(`${key}.answer`) },
      })),
    })
  }

  const data = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
