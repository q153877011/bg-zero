'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  en: 'EN',
  zh: '中文',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => l !== locale && switchLocale(l)}
          className={`px-2 py-1 text-[12px] font-medium rounded-lg transition-colors ${
            l === locale
              ? 'text-[var(--text-primary)] bg-[rgba(28,25,23,0.06)]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[rgba(28,25,23,0.04)]'
          }`}
          aria-current={l === locale ? 'true' : undefined}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  )
}
