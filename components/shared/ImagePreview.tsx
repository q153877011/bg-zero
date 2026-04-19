'use client'

import { useTranslations } from 'next-intl'
import { Image, ArrowRight, ImageOff } from 'lucide-react'
import styles from './ImagePreview.module.css'

interface ImagePreviewProps {
  originalSrc?: string | null
  originalInfo?: string
  resultSrc?: string | null
  isProcessing?: boolean
  progress?: number
}

export default function ImagePreview({
  originalSrc,
  originalInfo,
  resultSrc,
  isProcessing,
  progress,
}: ImagePreviewProps) {
  const t = useTranslations('upload')
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Original */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">{t('originalLabel')}</span>
          {originalInfo && (
            <span className="tag tag-gray text-[10px]">{originalInfo}</span>
          )}
        </div>
        <div className="rounded-xl overflow-hidden border border-[rgba(28,25,23,0.07)] bg-[var(--bg-secondary)] aspect-square flex items-center justify-center">
          {originalSrc ? (
            <img
              src={originalSrc}
              className="max-w-full max-h-full object-contain"
              alt={t('originalAlt')}
            />
          ) : (
            <div className="text-[var(--text-tertiary)] flex flex-col items-center gap-2">
              <Image size={28} />
              <span className="text-[12px]">{t('noImage')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="hidden sm:flex items-center text-[var(--text-tertiary)] self-center mt-6">
        <ArrowRight size={20} />
      </div>

      {/* Result */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">{t('resultLabel')}</span>
          {resultSrc && (
            <span className="tag tag-green text-[10px]">{t('pngTransparent')}</span>
          )}
        </div>
        <div
          className={`rounded-xl overflow-hidden border border-[rgba(28,25,23,0.07)] aspect-square flex items-center justify-center ${
            resultSrc ? 'checkerboard' : 'bg-[var(--bg-secondary)]'
          }`}
        >
          {resultSrc ? (
            <img
              src={resultSrc}
              className="max-w-full max-h-full object-contain"
              alt={t('resultAlt')}
            />
          ) : isProcessing ? (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
              <div className="w-full max-w-[160px]">
                <div className={`${styles['progress-bar']} mb-1.5`}>
                  <div className={styles['progress-bar-fill']} style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[12px] text-[var(--text-secondary)]">{progress}%</span>
              </div>
            </div>
          ) : (
            <div className="text-[var(--text-tertiary)] flex flex-col items-center gap-2">
              <ImageOff size={28} />
              <span className="text-[12px]">{t('showsAfter')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
