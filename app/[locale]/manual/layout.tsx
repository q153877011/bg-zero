import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ToolPageJsonLd } from '@/components/seo/JsonLd'
import { MANUAL_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/manual', title: t('manualTitle'), description: t('manualDescription') })
}

export default async function ManualLayout({
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
        faqKeys={MANUAL_FAQ_KEYS}
        toolName={t('manualTitle')}
        toolDescription={t('manualDescription')}
        toolUrl={buildPageUrl(locale, '/manual')}
      />
      {children}
    </>
  )
}
