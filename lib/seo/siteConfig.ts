export const siteConfig = {
  name: 'BG-Zero',
  domain: 'https://www.bg-zero.online',
  defaultLocale: 'en',
  locales: ['en', 'zh'] as const,
  twitterHandle: '@bgzero',
  // OG image is dynamically generated via app/opengraph-image.tsx.
  // This path is kept as a fallback for pages that pass a custom ogImage prop.
  ogImage: '/opengraph-image',
} as const

export type Locale = (typeof siteConfig.locales)[number]
