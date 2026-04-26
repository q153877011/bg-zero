import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ToolPageJsonLd } from '@/components/seo/JsonLd'
import { AUTO_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/auto', title: t('autoTitle'), description: t('autoDescription') })
}

export default async function AutoLayout({
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
        faqKeys={AUTO_FAQ_KEYS}
        toolName={t('autoTitle')}
        toolDescription={t('autoDescription')}
        toolUrl={buildPageUrl(locale, '/auto')}
      />
      {children}
    </>
  )
}
