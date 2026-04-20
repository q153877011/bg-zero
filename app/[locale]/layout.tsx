import type { Metadata } from 'next'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { GoogleAnalytics } from '@next/third-parties/google'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo/metadata'
import RootLayoutClient from '@/components/layout/RootLayoutClient'
import { HomeJsonLd } from '@/components/seo/JsonLd'
import CookieConsent from '@/components/shared/CookieConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GA_ENABLED = !!GA_ID && process.env.NODE_ENV === 'production'

// Google Consent Mode v2 — default deny everything until user grants.
// MUST be injected before gtag loads, otherwise the first pageview fires with consent undefined.
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`.trim()

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

  return buildMetadata({
    locale,
    path: '/',
    title: t('homeTitle'),
    description: t('homeDescription'),
  })
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {GA_ENABLED && (
          <Script
            id="ga-consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <HomeJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <RootLayoutClient>{children}</RootLayoutClient>
          {GA_ENABLED && <CookieConsent />}
        </NextIntlClientProvider>
        {GA_ENABLED && <GoogleAnalytics gaId={GA_ID!} />}
      </body>
    </html>
  )
}
