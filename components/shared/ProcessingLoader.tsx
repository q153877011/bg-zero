'use client'

import styles from './ProcessingLoader.module.css'

interface ProcessingLoaderProps {
  text?: string
  progress?: number
  showProgress?: boolean
}

export default function ProcessingLoader({ text, progress, showProgress }: ProcessingLoaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-[14px] font-medium text-[var(--text-primary)]">{text}</span>
      </div>
      {showProgress && (
        <>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-bar-fill']} style={{ width: `${progress || 0}%` }} />
          </div>
          <span className="text-[12px] text-[var(--text-secondary)]">{progress}%</span>
        </>
      )}
    </div>
  )
}
