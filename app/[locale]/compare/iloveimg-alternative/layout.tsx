import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/compare/iloveimg-alternative', title: t('compareIloveimgTitle'), description: t('compareIloveimgDescription') })
}

export default function CompareIloveimgLayout({ children }: { children: React.ReactNode }) {
  return children
}
