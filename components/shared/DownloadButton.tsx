'use client'

import { useMemo, useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import styles from './DownloadButton.module.css'

type DownloadState = 'idle' | 'preparing' | 'success'

interface DownloadButtonProps {
  blob?: Blob | null
  filename?: string
  label?: string
  className?: string
}

export default function DownloadButton({ blob, filename, label, className }: DownloadButtonProps) {
  const t = useTranslations('common')
  const displayLabel = useMemo(() => label ?? t('downloadPng'), [label, t])
  const { track } = useAnalytics()
  const [state, setState] = useState<DownloadState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doDownload = useCallback(async () => {
    if (!blob || state !== 'idle') return
    setState('preparing')
    await new Promise(r => setTimeout(r, 200))

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? 'bg-zero-result.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    const format = (filename ?? 'result.png').split('.').pop() || 'png'
    track('download', { page: 'auto', format })

    setState('success')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setState('idle'), 2400)
  }, [blob, state, filename, track])

  return (
    <button
      className={`${styles.btn} ${styles[`state-${state}`]} ${className ?? ''}`}
      disabled={!blob || state !== 'idle'}
      onClick={doDownload}
      aria-live="polite"
    >
      <span className={styles.labelStack}>
        <span className={styles.labelSlot} data-slot="idle">
          <Download size={16} />
          {displayLabel}
        </span>
        <span className={styles.labelSlot} data-slot="preparing">
          <span className={styles.spinner} />
          {t('preparing')}
        </span>
        <span className={styles.labelSlot} data-slot="success">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.checkPath}
            />
          </svg>
          {t('downloaded')}
        </span>
      </span>
      <span className={styles.rippleRing} aria-hidden="true" />
    </button>
  )
}
