export const siteConfig = {
  name: 'BG-Zero',
  domain: 'https://bg-zero.tech',
  defaultLocale: 'en',
  locales: ['en', 'zh'] as const,
  twitterHandle: '@bgzero',
  ogImage: '/og/og-default.svg',
} as const

export type Locale = (typeof siteConfig.locales)[number]
