'use client'

import { useTranslations } from 'next-intl'
import { Trash2, X } from 'lucide-react'
import type { PickedColor } from '@/lib/hooks/useColorPicker'
import styles from './ColorPicker.module.css'

interface ColorPickerProps {
  pickedColor: PickedColor | null
  onRemove: () => void
  onClear: () => void
}

export default function ColorPicker({ pickedColor, onRemove, onClear }: ColorPickerProps) {
  const t = useTranslations('manual')

  return (
    <div className={styles.wrapper}>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {pickedColor ? (
          <div className={styles.colorSwatch} style={{ background: pickedColor.hex }} />
        ) : (
          <div className={styles.emptyColor} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {pickedColor ? (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-[var(--text-primary)]">{pickedColor.hex}</span>
            <span className="text-[11px] text-[var(--text-tertiary)]">
              rgb({pickedColor.r}, {pickedColor.g}, {pickedColor.b})
            </span>
          </div>
        ) : (
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {t('pickHint')}
          </p>
        )}
      </div>

      {pickedColor && (
        <>
          <button className="btn btn-primary btn-sm flex-shrink-0" onClick={onRemove}>
            <Trash2 size={13} />
            {t('removeBtn')}
          </button>
          <button
            className="btn btn-ghost btn-sm flex-shrink-0 text-[var(--text-tertiary)]"
            onClick={onClear}
          >
            <X size={13} />
          </button>
        </>
      )}
    </div>
  )
}
