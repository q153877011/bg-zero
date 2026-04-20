'use client'

import { useEffect } from 'react'

/**
 * Registers the model caching Service Worker.
 * Call once in the root layout or app shell.
 */
export function useModelCacheWorker() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV === 'development'
    ) {
      return
    }

    navigator.serviceWorker
      .register('/model-cache-sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[ModelCache] Service Worker registered, scope:', reg.scope)
      })
      .catch((err) => {
        // Non-critical — models will still work, just won't be cached by SW
        console.warn('[ModelCache] Service Worker registration failed:', err)
      })
  }, [])
}
