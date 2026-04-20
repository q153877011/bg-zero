'use client'

import styles from './EngineLoadingStage.module.css'

interface EngineLoadingStageProps {
  show: boolean
  engineName: string
  stageText: string
  progress: number
  hint?: string
}

export default function EngineLoadingStage({ show, engineName, stageText, progress, hint }: EngineLoadingStageProps) {
  if (!show) return null
  return (
    <div className={styles.backdrop}>
      <div className={styles.console}>
        <div className={styles.blobWrap} aria-hidden="true">
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
        </div>

        <div className={styles.meta}>
          <span className={styles.engineTag}>{engineName}</span>
        </div>

        <p className={styles.stageText}>{stageText}</p>

        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}>
              <div className={styles.progressShimmer} />
            </div>
          </div>
          <span className={styles.progressNum}>{progress}%</span>
        </div>

        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </div>
  )
}
