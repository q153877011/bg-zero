import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { VIDEO_FAQ_KEYS } from '@/lib/constants/faq'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/blog/video-background-removal', title: t('blogVideoTitle'), description: t('blogVideoDescription') })
}

export default async function VideoRemovalLayout({
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
        title={t('blogVideoTitle')}
        description={t('blogVideoDescription')}
        url={buildPageUrl(locale, '/blog/video-background-removal')}
        datePublished="2026-04-28"
        dateModified="2026-04-28"
        faqKeys={VIDEO_FAQ_KEYS}
      />
      {children}
    </>
  )
}
