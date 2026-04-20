import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return buildMetadata({ locale, path: '/privacy', title: t('privacyTitle'), description: t('privacyDescription') })
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
