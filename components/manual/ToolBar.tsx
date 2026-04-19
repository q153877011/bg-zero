'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Pipette, Shield, CircleSlash, Undo2, Redo2, Eraser, Eye, EyeOff } from 'lucide-react'
import type { ToolMode } from '@/components/manual/ManualCanvas'
import styles from './ToolBar.module.css'

interface ToolBarProps {
  toolMode: ToolMode
  canUndo: boolean
  canRedo: boolean
  maskVisible: boolean
  onToolModeChange: (tool: ToolMode) => void
  onUndo: () => void
  onRedo: () => void
  onClearMask: () => void
  onToggleMaskVisible: () => void
}

export default function ToolBar({
  toolMode,
  canUndo,
  canRedo,
  maskVisible,
  onToolModeChange,
  onUndo,
  onRedo,
  onClearMask,
  onToggleMaskVisible,
}: ToolBarProps) {
  const t = useTranslations('manual')

  const tools = useMemo(() => [
    {
      id: 'pick' as ToolMode,
      Icon: Pipette,
      label: t('toolPick'),
      activeClass: 'text-[var(--accent-primary)] bg-[var(--accent-primary-light)]',
    },
    {
      id: 'mask' as ToolMode,
      Icon: Shield,
      label: t('toolProtect'),
      activeClass: 'text-emerald-700 bg-emerald-50',
    },
    {
      id: 'eraser' as ToolMode,
      Icon: CircleSlash,
      label: t('toolEraser'),
      activeClass: 'text-red-600 bg-red-50',
    },
  ], [t])

  return (
    <div className={styles.toolbar}>
      {/* Tool buttons */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
              toolMode === tool.id
                ? tool.activeClass
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
            title={tool.label}
            onClick={() => onToolModeChange(tool.id)}
          >
            <tool.Icon size={14} />
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.separator} />

      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          disabled={!canUndo}
          title={t('undoTooltip')}
          onClick={onUndo}
        >
          <Undo2 size={15} />
        </button>
        <button
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          disabled={!canRedo}
          title={t('redoTooltip')}
          onClick={onRedo}
        >
          <Redo2 size={15} />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Clear mask */}
      <button
        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-500 transition-all text-[12px] flex items-center gap-1.5"
        title={t('clearMaskTooltip')}
        onClick={onClearMask}
      >
        <Eraser size={14} />
        <span className="hidden sm:inline">{t('clearMask')}</span>
      </button>

      <div className={styles.spacer} />

      {/* Mask visibility toggle */}
      <button
        className={`p-1.5 rounded-lg transition-all text-[12px] flex items-center gap-1.5 ${
          maskVisible
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]'
        }`}
        title={t('toggleMaskTooltip')}
        onClick={onToggleMaskVisible}
      >
        {maskVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        <span className="hidden sm:inline">{maskVisible ? t('maskOn') : t('maskOff')}</span>
      </button>
    </div>
  )
}
