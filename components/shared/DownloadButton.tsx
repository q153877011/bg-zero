'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import styles from './DownloadButton.module.css'

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

  function doDownload() {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? 'bg-zero-result.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    const format = (filename ?? 'result.png').split('.').pop() || 'png'
    track('download', { page: 'auto', format })
  }

  return (
    <button
      className={`${styles.btn} ${className ?? ''}`}
      disabled={!blob}
      onClick={doDownload}
    >
      <Download size={16} />
      {displayLabel}
    </button>
  )
}
