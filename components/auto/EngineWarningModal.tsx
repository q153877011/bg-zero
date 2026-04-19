'use client'

import { useEffect, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, Info, Check } from 'lucide-react'
import styles from './EngineWarningModal.module.css'

interface EngineWarningModalProps {
  show: boolean
  engineLabel: string
  description: string
  notes: string[]
  children?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

export default function EngineWarningModal({
  show,
  engineLabel,
  description,
  notes,
  children,
  onConfirm,
  onCancel,
}: EngineWarningModalProps) {
  const t = useTranslations('auto')
  const tc = useTranslations('common')

  useEffect(() => {
    if (!show) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [show, onCancel])

  if (!show) return null

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.box}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-heading text-[16px] font-semibold mb-1">{t('switchTo', { engine: engineLabel })}</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Details */}
        <ul className="space-y-1.5 mb-5">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)]">
              <Info size={13} className="mt-0.5 flex-shrink-0 text-[var(--text-tertiary)]" />
              <span>{note}</span>
            </li>
          ))}
        </ul>

        {/* Slot content (e.g. rembg model selection) */}
        {children}

        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost btn-md" onClick={onCancel}>{tc('cancel')}</button>
          <button className="btn btn-primary btn-md" onClick={onConfirm}>
            <Check size={15} />
            {t('confirmLoad')}
          </button>
        </div>
      </div>
    </div>
  )
}
