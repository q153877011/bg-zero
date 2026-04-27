import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { PRIVACY_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/blog/private-background-remover',
    title: t('blogPrivacyTitle'),
    description: t('blogPrivacyDescription'),
  })
}

export default async function PrivacyRemoverLayout({
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
        title={t('blogPrivacyTitle')}
        description={t('blogPrivacyDescription')}
        url={buildPageUrl(locale, '/blog/private-background-remover')}
        datePublished="2026-04-27"
        dateModified="2026-04-27"
        faqKeys={PRIVACY_FAQ_KEYS}
      />
      {children}
    </>
  )
}
