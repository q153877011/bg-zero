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
