import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ToolPageJsonLd } from '@/components/seo/JsonLd'
import { ID_PHOTO_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/use-cases/id-photo', title: t('useCaseIdPhotoTitle'), description: t('useCaseIdPhotoDescription') })
}

export default async function IdPhotoLayout({
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
        faqKeys={ID_PHOTO_FAQ_KEYS}
        toolName={t('useCaseIdPhotoTitle')}
        toolDescription={t('useCaseIdPhotoDescription')}
        toolUrl={buildPageUrl(locale, '/use-cases/id-photo')}
      />
      {children}
    </>
  )
}
