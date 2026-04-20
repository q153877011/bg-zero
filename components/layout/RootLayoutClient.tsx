'use client'

import { usePathname } from '@/i18n/navigation'
import { useModelCacheWorker } from '@/lib/hooks/useModelCacheWorker'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

const fullscreenPages = ['/login', '/register', '/forgot-password', '/reset-password']

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = fullscreenPages.includes(pathname)

  // Register model caching Service Worker (production only)
  useModelCacheWorker()

  return (
    <div className="min-h-screen flex flex-col" style={isFullscreen ? { background: '#0C0B0F' } : undefined}>
      {!isFullscreen && <AppHeader />}
      <main className="flex-1">{children}</main>
      {!isFullscreen && <AppFooter />}
    </div>
  )
}
