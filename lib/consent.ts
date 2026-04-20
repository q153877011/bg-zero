/**
 * lib/consent.ts
 * Cookie consent state management + Google Consent Mode v2 integration.
 *
 * Flow:
 *  1. On first load → consent status is 'pending', GA defaults to 'denied' (set by gtagDefaults in RootLayoutClient)
 *  2. User clicks Accept → 'granted', gtag('consent', 'update', { analytics_storage: 'granted' })
 *  3. User clicks Reject → 'denied', gtag stays denied (IP is anonymized, no Cookie stored)
 *  4. Choice persisted in localStorage for 365 days
 */

export type ConsentStatus = 'pending' | 'granted' | 'denied'

const STORAGE_KEY = 'bgzero-consent-v1'
const EXPIRY_DAYS = 365

interface StoredConsent {
  status: Exclude<ConsentStatus, 'pending'>
  timestamp: number
}

export function loadConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 'pending'
    const parsed: StoredConsent = JSON.parse(raw)
    const ageDays = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24)
    if (ageDays > EXPIRY_DAYS) {
      localStorage.removeItem(STORAGE_KEY)
      return 'pending'
    }
    return parsed.status
  } catch {
    return 'pending'
  }
}

export function saveConsent(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return
  try {
    const data: StoredConsent = { status, timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage may be disabled (Safari private mode etc.) — silently ignore
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/**
 * Push a Google Consent Mode v2 update into the dataLayer.
 * Safe to call even before gtag is loaded — dataLayer is initialized by the default-consent script.
 */
export function pushConsentUpdate(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push([
    'consent',
    'update',
    {
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
      analytics_storage: status,
    },
  ])
}

/**
 * Browser-local region detection via IANA timezone.
 * Zero API calls, zero IP tracking — perfectly aligned with our local-first ethos.
 *
 * Covers:
 *   - EU (27 member states) — GDPR applies
 *   - UK — UK GDPR applies (same consent rules)
 *   - EEA extras (Iceland, Liechtenstein, Norway) — GDPR applies via EEA agreement
 *   - Switzerland — FADP (similar requirements)
 *
 * VPN users can fake timezone, but GDPR technically only requires compliance for
 * users physically located in the EU/EEA, so detecting "browser claims to be in EU"
 * is the legally relevant signal.
 */
const EU_EEA_TIMEZONE_PREFIXES = [
  // EU 27 + UK + EEA — all timezones under Europe/* except a few non-EU ones
  'Europe/',
  // Atlantic territories that are part of EU
  'Atlantic/Azores',     // Portugal
  'Atlantic/Madeira',    // Portugal
  'Atlantic/Canary',     // Spain
  'Atlantic/Reykjavik',  // Iceland (EEA)
] as const

// Europe/* timezones that are NOT in EU/EEA/UK (excluded from GDPR scope)
const EUROPE_NON_EU_TIMEZONES = new Set([
  'Europe/Moscow',
  'Europe/Kaliningrad',
  'Europe/Samara',
  'Europe/Volgograd',
  'Europe/Saratov',
  'Europe/Ulyanovsk',
  'Europe/Astrakhan',
  'Europe/Kirov',
  'Europe/Minsk',         // Belarus
  'Europe/Istanbul',      // Turkey
  'Europe/Kiev',          // Ukraine (pre-2022 IANA name)
  'Europe/Kyiv',          // Ukraine (new IANA name)
  'Europe/Simferopol',    // Crimea (disputed)
  'Europe/Uzhgorod',      // Ukraine
  'Europe/Zaporozhye',    // Ukraine
  'Europe/Chisinau',      // Moldova
  'Europe/Tiraspol',      // Transnistria
  'Europe/Belgrade',      // Serbia — not in EU
  'Europe/Sarajevo',      // Bosnia — not in EU
  'Europe/Skopje',        // North Macedonia — not in EU
  'Europe/Podgorica',     // Montenegro — not in EU
  'Europe/Tirane',        // Albania — not in EU
])

export function isLikelyInEUEEA(): boolean {
  if (typeof Intl === 'undefined') return false
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return false
    if (EUROPE_NON_EU_TIMEZONES.has(tz)) return false
    return EU_EEA_TIMEZONE_PREFIXES.some(prefix => tz.startsWith(prefix))
  } catch {
    return false
  }
}
