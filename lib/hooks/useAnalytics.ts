/**
 * lib/hooks/useAnalytics.ts
 * Batched, non-blocking event tracking.
 *
 * Strategy:
 *   - Queue events in memory
 *   - Flush on: 3s debounce, batch size ≥ 10, or page hidden
 *   - Use sendBeacon when possible (survives page unload without blocking navigation)
 *   - Fire-and-forget; analytics must never affect core UX
 *
 * This reduces per-session API calls from 6-10 down to typically 1-2,
 * dramatically lowering Vercel Edge Request / Function Invocation cost.
 */

const ALLOWED_EVENTS = [
  'image_upload', 'engine_switch',
  'process_start', 'process_done', 'process_error',
  'download', 'manual_remove', 'manual_mask',
  'sign_up', 'sign_in',
] as const

type EventName = typeof ALLOWED_EVENTS[number]

interface QueuedEvent {
  event: EventName
  metadata: Record<string, unknown>
  ts: number
}

const BATCH_MAX = 10
const FLUSH_DEBOUNCE_MS = 3000

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let listenersAttached = false

function flush() {
  if (queue.length === 0) return
  const events = queue
  queue = []
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  const payload = JSON.stringify({ events })

  // Prefer sendBeacon — guaranteed delivery even during page unload,
  // doesn't block navigation, handled by browser background.
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: 'application/json' })
      const ok = navigator.sendBeacon('/api/analytics', blob)
      if (ok) return
    } catch {
      // fall through to fetch
    }
  }

  // Fallback: keepalive fetch (best-effort, may be cancelled on unload)
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Swallow — analytics must never throw
  }
}

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(flush, FLUSH_DEBOUNCE_MS)
}

function attachUnloadListeners() {
  if (listenersAttached || typeof document === 'undefined') return
  listenersAttached = true

  // The most reliable signal for "user is leaving" across mobile + desktop
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })

  // Safety net for actual unload
  window.addEventListener('pagehide', () => flush())
}

export function useAnalytics() {
  function track(event: EventName, metadata: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return
    attachUnloadListeners()

    queue.push({ event, metadata, ts: Date.now() })

    if (queue.length >= BATCH_MAX) {
      flush()
    } else {
      scheduleFlush()
    }
  }

  return { track }
}
