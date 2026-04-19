'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  en: 'English',
  zh: '中文',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales
        .filter((l) => l !== locale)
        .map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className="px-2.5 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(28,25,23,0.05)] rounded-lg transition-colors"
          >
            {localeLabels[l]}
          </button>
        ))}
    </div>
  )
}
