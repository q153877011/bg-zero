import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

const messageImports = {
  en: () => import('../messages/en.json'),
  zh: () => import('../messages/zh.json'),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  const importFn = messageImports[locale as keyof typeof messageImports] ?? messageImports.en

  return {
    locale,
    messages: (await importFn()).default,
  }
})
