import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { WEBP_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/blog/webp-remove-background',
    title: t('blogWebpTitle'),
    description: t('blogWebpDescription'),
  })
}

export default async function WebpRemoveBgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

  return (
    <>
      <ArticleJsonLd
        locale={locale}
        title={t('blogWebpTitle')}
        description={t('blogWebpDescription')}
        url={buildPageUrl(locale, '/blog/webp-remove-background')}
        datePublished="2026-04-27"
        dateModified="2026-04-27"
        faqKeys={WEBP_FAQ_KEYS}
      />
      {children}
    </>
  )
}
