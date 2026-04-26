import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ToolPageJsonLd } from '@/components/seo/JsonLd'
import { COMPARE_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/compare/best-background-removers', title: t('compareBestTitle'), description: t('compareBestDescription') })
}

export default async function CompareBestLayout({
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
      <ToolPageJsonLd
        locale={locale}
        faqKeys={COMPARE_FAQ_KEYS}
        toolName={t('compareBestTitle')}
        toolDescription={t('compareBestDescription')}
        toolUrl={buildPageUrl(locale, '/compare/best-background-removers')}
      />
      {children}
    </>
  )
}
