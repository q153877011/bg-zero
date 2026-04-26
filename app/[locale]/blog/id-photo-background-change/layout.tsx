import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/blog/id-photo-background-change',
    title: t('blogIdPhotoTitle'),
    description: t('blogIdPhotoDescription'),
  })
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
      <ArticleJsonLd
        locale={locale}
        title={t('blogIdPhotoTitle')}
        description={t('blogIdPhotoDescription')}
        url={buildPageUrl(locale, '/blog/id-photo-background-change')}
        datePublished="2026-04-28"
        dateModified="2026-04-28"
      />
      {children}
    </>
  )
}
