'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import styles from './MaskBrush.module.css'

interface MaskBrushProps {
  value: number
  onChange: (value: number) => void
}

export default function MaskBrush({ value, onChange }: MaskBrushProps) {
  const t = useTranslations('manual')

  const brushPreviewStyle = useMemo(() => {
    const size = Math.min(value, 36)
    return { width: size + 'px', height: size + 'px' }
  }, [value])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--text-secondary)]">{t('brushSize')}</span>
        <span className="text-[12px] font-mono text-[var(--text-primary)] tabular-nums">{value}px</span>
      </div>

      <input
        type="range"
        min={4}
        max={120}
        value={value}
        className={styles.slider}
        onChange={(e) => onChange(+e.target.value)}
      />

      {/* Brush preview */}
      <div className={styles.preview}>
        <div className={styles.previewDot} style={brushPreviewStyle} />
      </div>
    </div>
  )
}
