'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 通用倒计时 hook
 * 供重发冷却、自动跳转等场景共用
 */
export function useResendCooldown(seconds = 60) {
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef<(() => void) | undefined>(undefined)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setCooldown(0)
  }, [])

  const start = useCallback((onComplete?: () => void) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    onCompleteRef.current = onComplete
    setCooldown(seconds)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        const next = prev - 1
        if (next <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          onCompleteRef.current?.()
          return 0
        }
        return next
      })
    }, 1000)
  }, [seconds])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  return { cooldown, start, stop }
}
