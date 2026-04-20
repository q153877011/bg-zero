import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/use-cases/ecommerce', title: t('useCaseEcommerceTitle'), description: t('useCaseEcommerceDescription') })
}

export default function UseCaseEcommerceLayout({ children }: { children: React.ReactNode }) {
  return children
}
