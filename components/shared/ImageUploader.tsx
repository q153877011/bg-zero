'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { ImagePlus, AlertCircle } from 'lucide-react'
import { useImageUpload } from '@/lib/hooks/useImageUpload'
import type { UploadedImage } from '@/lib/hooks/useImageUpload'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  onUpload: (image: UploadedImage) => void
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const t = useTranslations('upload')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const { processFile, isLoading, uploadError, uploadedImage } = useImageUpload(t)

  useEffect(() => {
    if (uploadedImage) {
      onUpload(uploadedImage)
    }
  }, [uploadedImage, onUpload])

  function triggerFileInput() {
    inputRef.current?.click()
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
      e.target.value = ''
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDraggingOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) await processFile(file)
  }

  const onPaste = useCallback(async (e: ClipboardEvent) => {
    const file = Array.from(e.clipboardData?.items ?? [])
      .find(i => i.type.startsWith('image/'))
      ?.getAsFile()
    if (file) await processFile(file)
  }, [processFile])

  useEffect(() => {
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [onPaste])

  return (
    <div>
      <div
        className={`${styles['upload-zone']} relative flex flex-col items-center justify-center gap-4 p-10 cursor-pointer select-none min-h-[220px] ${isDraggingOver ? styles['drag-over'] : ''}`}
        role="button"
        tabIndex={0}
        aria-label={t('ariaLabel')}
        onClick={triggerFileInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            triggerFileInput()
          }
        }}
        onDragEnter={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false) }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />

        <div
          className={`w-14 h-14 rounded-2xl bg-[var(--accent-primary-light)] flex items-center justify-center transition-transform duration-200 ${isDraggingOver || isLoading ? 'scale-110' : ''}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImagePlus size={24} className="text-[var(--accent-primary)]" />
          )}
        </div>

        <div className="text-center">
          <p className="font-heading font-semibold text-[var(--text-primary)] text-[15px] mb-1">
            {isDraggingOver ? t('dropToUpload') : isLoading ? t('reading') : t('dragHint')}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">
            {t.rich('orClickSupports', {
              highlight: (chunks) => <span className="text-[var(--accent-primary)] font-medium">{chunks}</span>
            })}
          </p>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">{t('maxSizePaste')}</p>
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[12px] text-red-600 ${styles.fade}`}>
          <AlertCircle size={14} className="flex-shrink-0" />
          {uploadError}
        </div>
      )}
    </div>
  )
}
