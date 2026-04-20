import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/use-cases/profile-picture', title: t('useCaseProfileTitle'), description: t('useCaseProfileDescription') })
}

export default function UseCaseProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
