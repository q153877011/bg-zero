import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { buildPageUrl } from '@/lib/seo/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/blog/how-to-remove-background',
    title: t('blogHowToRemoveBgTitle'),
    description: t('blogHowToRemoveBgDescription'),
  })
}

export default async function HowToRemoveBgLayout({
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
        title={t('blogHowToRemoveBgTitle')}
        description={t('blogHowToRemoveBgDescription')}
        url={buildPageUrl(locale, '/blog/how-to-remove-background')}
        datePublished="2026-04-28"
        dateModified="2026-04-28"
      />
      {children}
    </>
  )
}
