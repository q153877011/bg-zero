import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/blog', title: t('blogTitle'), description: t('blogDescription') })
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
