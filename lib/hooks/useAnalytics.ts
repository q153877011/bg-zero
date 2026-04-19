/**
 * lib/hooks/useAnalytics.ts
 * Lightweight event tracking — fire-and-forget, never blocks UI.
 */

const ALLOWED_EVENTS = [
  'page_view', 'image_upload', 'engine_switch',
  'process_start', 'process_done', 'process_error',
  'download', 'manual_remove', 'manual_mask',
  'sign_up', 'sign_in',
] as const

type EventName = typeof ALLOWED_EVENTS[number]

export function useAnalytics() {
  async function track(event: EventName, metadata: Record<string, any> = {}) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, metadata }),
      })
    } catch {
      // Silent failure — analytics must never affect core UX
    }
  }

  return { track }
}
