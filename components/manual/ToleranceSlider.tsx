'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import styles from './ToleranceSlider.module.css'

interface ToleranceSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function ToleranceSlider({ value, onChange }: ToleranceSliderProps) {
  const t = useTranslations('manual')

  const presets = useMemo(() => [
    { label: t('tolerancePrecise'), value: 15 },
    { label: t('toleranceStandard'), value: 35 },
    { label: t('toleranceBroad'), value: 65 },
  ], [t])

  const progressPercent = useMemo(() => `${(value / 120) * 100}%`, [value])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--text-secondary)]">{t('colorTolerance')}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-mono text-[var(--text-primary)] tabular-nums w-6 text-right">{value}</span>
          <span className="text-[11px] text-[var(--text-tertiary)]">/ 255</span>
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={0}
          max={120}
          value={value}
          style={{ '--progress': progressPercent } as React.CSSProperties}
          className={styles.slider}
          onChange={(e) => onChange(+e.target.value)}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between px-0.5">
        <span className="text-[10px] text-[var(--text-tertiary)]">{t('tolerancePrecise')}</span>
        <span className="text-[10px] text-[var(--text-tertiary)]">{t('toleranceBroad')}</span>
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 mt-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            className={`flex-1 py-1 rounded-lg border text-[11px] font-medium transition-all duration-150 ${
              value === preset.value
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)] text-[var(--accent-primary)]'
                : 'border-[rgba(28,25,23,0.09)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
            }`}
            onClick={() => onChange(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
