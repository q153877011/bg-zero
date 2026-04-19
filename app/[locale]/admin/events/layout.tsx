import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({ locale, path: '/admin/events', title: t('adminEventsTitle'), description: t('adminEventsDescription'), noindex: true })
}

export default function AdminEventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
