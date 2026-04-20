'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { RefreshCcw, Sparkles, AlertCircle, X, ImageOff } from 'lucide-react'
import { useAutoRemoval, REMBG_MODELS } from '@/lib/hooks/useAutoRemoval'
import type { EngineType, RembgModel } from '@/lib/hooks/useAutoRemoval'
import { useDownload } from '@/lib/hooks/useDownload'
import type { UploadedImage } from '@/lib/hooks/useImageUpload'
import EngineSelector from '@/components/auto/EngineSelector'
import EngineWarningModal from '@/components/auto/EngineWarningModal'
import EngineLoadingStage from '@/components/auto/EngineLoadingStage'
import DownloadButton from '@/components/shared/DownloadButton'
import { useDelayedState } from '@/lib/hooks/useDelayedState'
import styles from './AutoProcessor.module.css'

const engineLabels: Record<EngineType, string> = {
  imgly: 'imgly',
  transformers: 'Transformers.js',
  'rembg-web': 'rembg-web',
}

export default function AutoProcessor() {
  const t = useTranslations('auto')
  const tc = useTranslations('common')

  const rembgDescMap: Record<string, string> = useMemo(() => ({
    u2netp: t('rembgU2netp'),
    silueta: t('rembgSilueta'),
    u2net_human_seg: t('rembgHumanSeg'),
    'isnet-general-use': t('rembgIsnetGeneral'),
    'isnet-anime': t('rembgIsnetAnime'),
    u2net: t('rembgU2net'),
  }), [t])

  const {
    currentEngine,
    selectedRembgModel,
    switchEngine,
    isLoadingEngine,
    engineLoadProgress,
    engineLoadText,
    isProcessing,
    processProgress,
    resultBlob,
    error,
    process: runProcess,
    clearResult,
    webGPUAvailable,
    sharedArrayBufferAvailable,
  } = useAutoRemoval(t)

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [readingFileName, setReadingFileName] = useState('')

  // Engine warning modal
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [pendingEngine, setPendingEngine] = useState<EngineType | null>(null)
  const [pendingRembgModel, setPendingRembgModel] = useState<RembgModel>('u2netp')

  const engineDescriptions = useMemo(() => ({
    imgly: t('engineImglyDesc'),
    transformers: t('engineTransformersDesc'),
    'rembg-web': t('engineRembgDesc'),
  }), [t])

  const engineNotes = useMemo(() => ({
    imgly: [t('engineImglyNote1'), t('engineImglyNote2'), t('engineImglyNote3')],
    transformers: [t('engineTransformersNote1'), t('engineTransformersNote2'), t('engineTransformersNote3'), t('engineTransformersNote4')],
    'rembg-web': [t('engineRembgNote1'), t('engineRembgNote2'), t('engineRembgNote3')],
  }), [t])

  // Result URL lifecycle
  useEffect(() => {
    if (resultBlob) {
      const url = URL.createObjectURL(resultBlob)
      setResultUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setResultUrl(null)
    }
  }, [resultBlob])

  const handleEngineSelect = useCallback((engine: EngineType) => {
    if (engine === currentEngine) return
    setPendingEngine(engine)
    if (engine === 'rembg-web') {
      setPendingRembgModel(selectedRembgModel)
    }
    setShowWarningModal(true)
  }, [currentEngine, selectedRembgModel])

  const handleRembgModelSelect = useCallback((modelId: string) => {
    if (currentEngine === 'rembg-web' && modelId !== selectedRembgModel) {
      setPendingEngine('rembg-web')
      setPendingRembgModel(modelId as RembgModel)
      setShowWarningModal(true)
    }
  }, [currentEngine, selectedRembgModel])

  const confirmEngineSwitch = useCallback(async () => {
    setShowWarningModal(false)
    if (!pendingEngine) return
    const engine = pendingEngine
    const model = engine === 'rembg-web' ? pendingRembgModel : undefined
    await switchEngine(engine, model)
    setPendingEngine(null)
  }, [pendingEngine, pendingRembgModel, switchEngine])

  const cancelEngineSwitch = useCallback(() => {
    setShowWarningModal(false)
    setPendingEngine(null)
  }, [])

  const onUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image)
    clearResult()
  }, [clearResult])

  const handleProcess = useCallback(async () => {
    if (!uploadedImage) return
    if (resultBlob) {
      const ok = window.confirm(t('confirmReprocess'))
      if (!ok) return
    }
    clearResult()
    await runProcess(uploadedImage.file)
  }, [uploadedImage, resultBlob, clearResult, runProcess, t])

  const handleRetry = useCallback(async () => {
    if (!uploadedImage) return
    clearResult()
    await runProcess(uploadedImage.file)
  }, [uploadedImage, clearResult, runProcess])

  const handleReset = useCallback(() => {
    setUploadedImage(null)
    clearResult()
  }, [clearResult])

  const statusText = useMemo(() => {
    if (isLoadingEngine) return engineLoadText || t('statusLoading')
    if (isProcessing) return t('statusProcessing', { progress: processProgress })
    if (error) return t('statusError')
    if (resultBlob) return t('statusDone')
    return t('statusReady')
  }, [isLoadingEngine, engineLoadText, isProcessing, processProgress, error, resultBlob, t])

  const { getResultFilename } = useDownload()

  const downloadFilename = useMemo(
    () => getResultFilename(uploadedImage?.file.name),
    [uploadedImage, getResultFilename]
  )

  const showEngineLoading = useDelayedState(isLoadingEngine, { showAfter: 200, hideAfter: 400 })

  // Upload zone (when no image)
  if (!uploadedImage) {
    return (
      <div className={styles.fadeUp}>
        <div
          className="border-2 border-dashed border-[rgba(28,25,23,0.15)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors relative overflow-hidden"
          onClick={() => {
            if (isReadingFile) return
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (!file) return
              setIsReadingFile(true)
              setReadProgress(0)
              setReadingFileName(file.name)
              const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onprogress = (ev) => {
                  if (ev.lengthComputable) setReadProgress(Math.round(ev.loaded / ev.total * 100))
                }
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
              })
              setReadProgress(100)
              const img = new Image()
              img.onload = () => {
                onUpload({
                  file,
                  dataUrl,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  sizeKB: Math.round(file.size / 1024),
                })
                setIsReadingFile(false)
                setReadProgress(0)
              }
              img.src = dataUrl
            }
            input.click()
          }}
        >
          {isReadingFile ? (
            <div className={styles.readingStage}>
              <div className={styles.readingSpinner} />
              <p className={styles.readingName}>{readingFileName}</p>
              <div className={styles.readingBar}>
                <div className={styles.readingBarFill} style={{ width: `${readProgress}%` }} />
              </div>
              <p className={styles.readingPct}>{readProgress}%</p>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--text-secondary)]">{t('uploadHint')}</p>
          )}
        </div>
      </div>
    )
  }

  // Main workspace
  return (
    <div className={`${styles.fadeUp} space-y-3`}>
      {/* Top: original + result preview */}
      <div className="bg-[var(--bg-canvas)] border border-[rgba(28,25,23,0.07)] rounded-2xl overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(28,25,23,0.06)]">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isProcessing ? 'bg-amber-400 animate-pulse' : resultBlob ? `bg-emerald-400 ${styles.dotSuccess}` : 'bg-[var(--text-tertiary)]'
              }`}
            />
            <span className="text-[13px] font-medium text-[var(--text-secondary)]">{statusText}</span>
          </div>
          <button className="btn btn-ghost btn-sm text-[12px]" onClick={handleReset}>
            <RefreshCcw size={13} />
            {tc('reUpload')}
          </button>
        </div>

        {/* Preview panels */}
        <div className="grid grid-cols-2 divide-x divide-[rgba(28,25,23,0.06)]">
          {/* Original */}
          <div className="p-3">
            <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">{t('original')}</p>
            <div
              className={`relative aspect-square rounded-xl overflow-hidden bg-[var(--bg-secondary)] cursor-pointer group ${styles.reuploadWrap}`}
              onClick={handleReset}
              title={tc('reUpload')}
            >
              <img
                src={uploadedImage.dataUrl}
                className={`absolute inset-0 w-full h-full object-contain ${styles.previewFadeIn} transition-opacity duration-150 group-hover:opacity-60`}
                alt={uploadedImage.file.name}
              />
              <div className={styles.reuploadOverlay}>
                <RefreshCcw size={20} />
                <span>{tc('reUpload')}</span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5 truncate">
              {uploadedImage.file.name} · {uploadedImage.sizeKB > 1024 ? (uploadedImage.sizeKB / 1024).toFixed(1) + ' MB' : uploadedImage.sizeKB + ' KB'}
            </p>
          </div>

          {/* Result */}
          <div className="p-3">
            <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">{t('result')}</p>
            <div className={`relative aspect-square rounded-xl overflow-hidden ${resultBlob ? styles.checkerboard : 'bg-[var(--bg-secondary)]'}`}>
              {/* Processing overlay */}
              {isProcessing && (
                <div className={styles.processingOverlay}>
                  <div className={styles.scanLine} />
                  <div className={styles.processingCore}>
                    <div className={styles.auroraPulse} />
                    <span className={styles.processingPct}>{processProgress}%</span>
                    <div className={styles.miniProgress}>
                      <div className={styles.miniProgressFill} style={{ width: `${processProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Result image */}
              {resultUrl && (
                <img
                  src={resultUrl}
                  className={`absolute inset-0 w-full h-full object-contain ${styles.resultReveal}`}
                  alt={t('resultAlt')}
                />
              )}

              {/* Empty placeholder */}
              {!resultBlob && !isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ImageOff size={28} className="text-[var(--text-tertiary)] mb-1 opacity-40 mx-auto" />
                    <p className="text-[11px] text-[var(--text-tertiary)] opacity-60">{t('emptyHint')}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">
              {resultBlob ? t('resultPng') : '\u00A0'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 ${styles.errorShake}`}>
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-red-700">{t('errorTitle')}</p>
            <p className="text-[12px] text-red-500 mt-0.5">{error}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="text-[12px] font-medium text-red-600 hover:text-red-800 underline underline-offset-2"
              onClick={handleRetry}
            >
              {tc('retry')}
            </button>
            <button onClick={clearResult} className="text-red-400 hover:text-red-600">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Engine Selector */}
      <EngineSelector
        currentEngine={currentEngine}
        selectedRembgModel={selectedRembgModel}
        isLoadingEngine={isLoadingEngine}
        loadingText={engineLoadText}
        loadProgress={engineLoadProgress}
        webGPUAvailable={webGPUAvailable}
        sharedArrayBufferAvailable={sharedArrayBufferAvailable}
        onSelectEngine={handleEngineSelect}
        onSelectRembgModel={handleRembgModelSelect}
      />

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <button
          className="flex-1 btn btn-primary btn-lg"
          disabled={isProcessing || isLoadingEngine}
          onClick={handleProcess}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{t('btnProcessing')}</span>
            </>
          ) : isLoadingEngine ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{t('btnEngineLoading')}</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>{resultBlob ? t('btnReprocess') : t('btnStart')}</span>
            </>
          )}
        </button>

        {resultBlob && (
          <DownloadButton
            blob={resultBlob}
            filename={downloadFilename}
            className="btn btn-ghost btn-lg"
          />
        )}
      </div>

      {/* Engine Warning Modal */}
      <EngineWarningModal
        show={showWarningModal}
        engineLabel={pendingEngine ? engineLabels[pendingEngine] : ''}
        description={pendingEngine ? engineDescriptions[pendingEngine] : ''}
        notes={pendingEngine ? engineNotes[pendingEngine] : []}
        onConfirm={confirmEngineSwitch}
        onCancel={cancelEngineSwitch}
      >
        {/* rembg model selection inside modal */}
        {pendingEngine === 'rembg-web' && (
          <div className="mb-4">
            <p className="text-[12px] font-medium text-[var(--text-secondary)] mb-2">{t('selectModelToLoad')}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {REMBG_MODELS.map((model) => (
                <button
                  key={model.id}
                  className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                    pendingRembgModel === model.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)]'
                      : 'border-[rgba(28,25,23,0.09)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)]'
                  }`}
                  onClick={() => setPendingRembgModel(model.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">{model.label}</span>
                    {'recommended' in model && model.recommended && (
                      <span className="tag tag-green" style={{ fontSize: 9, padding: '0 4px' }}>{t('engineRecommended')}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-tertiary)]">{model.size} · {rembgDescMap[model.id] || model.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </EngineWarningModal>

      <EngineLoadingStage
        show={showEngineLoading}
        engineName={engineLabels[currentEngine]}
        stageText={engineLoadText || t('statusLoading')}
        progress={engineLoadProgress}
        hint={t('tip5')}
      />
    </div>
  )
}
