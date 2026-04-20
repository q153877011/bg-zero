import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return buildMetadata({ locale, path: '/terms', title: t('termsTitle'), description: t('termsDescription') })
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
