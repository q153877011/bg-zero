'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Paintbrush, MousePointerClick, Shield, Undo2, Pipette, SlidersHorizontal, Circle, Info, Keyboard, RefreshCcw, Download } from 'lucide-react'
import { floodFillRemove } from '@/lib/utils/canvas'
import { useColorPicker } from '@/lib/hooks/useColorPicker'
import { useDownload } from '@/lib/hooks/useDownload'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { useImageUpload } from '@/lib/hooks/useImageUpload'
import type { UploadedImage } from '@/lib/hooks/useImageUpload'
import ImageUploader from '@/components/shared/ImageUploader'
import ManualCanvas from '@/components/manual/ManualCanvas'
import ToolBar from '@/components/manual/ToolBar'
import ColorPicker from '@/components/manual/ColorPicker'
import ToleranceSlider from '@/components/manual/ToleranceSlider'
import MaskBrush from '@/components/manual/MaskBrush'
import styles from './page.module.css'

// definePageMeta({ auth: true }) — handled by proxy

interface HistoryFrame { imageData: ImageData; mask: Uint8Array }

export default function ManualPage() {
  const { track } = useAnalytics()
  const t = useTranslations('manual')
  const tc = useTranslations('common')
  const { pickedColor, hoverColor, confirmPick, updateHover, clearHover, clearPick } = useColorPicker()
  const { downloadBlob, getResultFilename } = useDownload()

  const instructions = useMemo(() => [
    { text: t('instruction1'), color: 'glIndigo' },
    { text: t('instruction2'), color: 'glAmber' },
    { text: t('instruction3'), color: 'glRed' },
    { text: t('instruction4'), color: 'glIndigo' },
    { text: t('instruction5'), color: 'glGreen' },
    { text: t('instruction6'), color: 'glPurple' },
  ], [t])

  const shortcuts = useMemo(() => [
    { key: 'P / 1', label: t('shortcutPick') },
    { key: 'M / 2', label: t('shortcutMask') },
    { key: 'E / 3', label: t('shortcutEraser') },
    { key: 'Ctrl+Z', label: t('shortcutUndo') },
    { key: 'Ctrl+Y', label: t('shortcutRedo') },
  ], [t])

  useEffect(() => {
    track('page_view', { page: '/manual' })
  }, [track])

  // ---- Refs ----
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [hasResult, setHasResult] = useState(false)
  const manualCanvasRef = useRef<any>(null)

  const [toolMode, setToolMode] = useState<'pick' | 'mask' | 'eraser'>('pick')
  const [brushSize, setBrushSize] = useState(20)
  const [tolerance, setTolerance] = useState(35)
  const [maskVisible, setMaskVisible] = useState(true)

  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const maskDataArrRef = useRef<Uint8Array>(new Uint8Array(0))
  const currentCleanDataRef = useRef<ImageData | null>(null)

  const historyRef = useRef<HistoryFrame[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [historyLength, setHistoryLength] = useState(0)

  const MAX_HISTORY = useMemo(() => {
    if (!imgWidth || !imgHeight) return 20
    const bytesPerFrame = imgWidth * imgHeight * 4
    const maxBytes = 200 * 1024 * 1024
    return Math.max(3, Math.min(20, Math.floor(maxBytes / bytesPerFrame)))
  }, [imgWidth, imgHeight])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < historyLength - 1

  const maskTrackedRef = useRef(false)
  const lastPickImgXRef = useRef(0)
  const lastPickImgYRef = useRef(0)

  function snapshotImageData(): ImageData | null {
    return manualCanvasRef.current?.getImageData() ?? null
  }

  function pushHistory() {
    const imageData = currentCleanDataRef.current
    if (!imageData) return
    const history = historyRef.current
    history.splice(historyIndex + 1)
    history.push({ imageData, mask: new Uint8Array(maskDataArrRef.current) })
    if (history.length > MAX_HISTORY) history.shift()
    const newIndex = history.length - 1
    setHistoryIndex(newIndex)
    setHistoryLength(history.length)
  }

  async function onUpload(image: UploadedImage) {
    setUploadedImage(image)
    setHasResult(false)
    historyRef.current = []
    setHistoryIndex(-1)
    setHistoryLength(0)
    requestAnimationFrame(() => {
      if (manualCanvasRef.current) manualCanvasRef.current.loadImage(image.file)
    })
  }

  function onImageLoaded(width: number, height: number) {
    setImgWidth(width)
    setImgHeight(height)
    maskDataArrRef.current = new Uint8Array(width * height)
    requestAnimationFrame(() => {
      const imageData = snapshotImageData()
      if (imageData) {
        currentCleanDataRef.current = imageData
        pushHistory()
      }
    })
  }

  function getCanvasTransform() {
    const c = manualCanvasRef.current
    if (!c) return { scale: 1, offsetX: 0, offsetY: 0 }
    const scale = typeof c.drawScale === 'object' ? c.drawScale.value : (c.drawScale ?? 1)
    const offsetX = typeof c.drawOffsetX === 'object' ? c.drawOffsetX.value : (c.drawOffsetX ?? 0)
    const offsetY = typeof c.drawOffsetY === 'object' ? c.drawOffsetY.value : (c.drawOffsetY ?? 0)
    return { scale, offsetX, offsetY }
  }

  function onCanvasClick(_x: number, _y: number, imgX: number, imgY: number) {
    if (toolMode !== 'pick') return
    const ctx = manualCanvasRef.current?.getCtx()
    if (!ctx) return
    lastPickImgXRef.current = imgX
    lastPickImgYRef.current = imgY
    const { scale, offsetX, offsetY } = getCanvasTransform()
    confirmPick(ctx, imgX * scale + offsetX, imgY * scale + offsetY)
  }

  function onHoverUpdate(imgX: number, imgY: number) {
    if (toolMode !== 'pick') return
    const ctx = manualCanvasRef.current?.getCtx()
    if (!ctx) return
    const { scale, offsetX, offsetY } = getCanvasTransform()
    updateHover(ctx, imgX * scale + offsetX, imgY * scale + offsetY)
    manualCanvasRef.current?.setHoverColor(hoverColor ?? null)
  }

  function onBrushPaint(imgX: number, imgY: number, erase: boolean) {
    if (!imgWidth || !imgHeight) return
    if (!erase && !maskTrackedRef.current) { maskTrackedRef.current = true; track('manual_mask', {}) }
    const radius = Math.floor(brushSize / 2)
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue
        const px = imgX + dx, py = imgY + dy
        if (px < 0 || px >= imgWidth || py < 0 || py >= imgHeight) continue
        maskDataArrRef.current[py * imgWidth + px] = erase ? 0 : 1
      }
    }
    refreshDisplay()
  }

  function refreshDisplay() {
    const canvas = manualCanvasRef.current
    if (!canvas) return
    if (currentCleanDataRef.current) canvas.putImageData(currentCleanDataRef.current)
    if (maskVisible) renderMaskOnDisplay()
  }

  function renderMaskOnDisplay() {
    const canvas = manualCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getCtx()
    if (!ctx) return
    const { scale, offsetX, offsetY } = getCanvasTransform()
    const canvasEl = typeof canvas.canvasRef === 'object' && 'value' in canvas.canvasRef ? canvas.canvasRef.value : canvas.canvasRef
    const w = imgWidth, h = imgHeight
    const imageData = ctx.getImageData(0, 0, canvasEl?.width ?? 800, canvasEl?.height ?? 400)
    const d = imageData.data, canvasW = imageData.width
    for (let iy = 0; iy < h; iy++) {
      for (let ix = 0; ix < w; ix++) {
        if (!maskDataArrRef.current[iy * w + ix]) continue
        const cx = Math.round(ix * scale + offsetX), cy = Math.round(iy * scale + offsetY)
        const i = (cy * canvasW + cx) * 4
        if (i < 0 || i + 3 >= d.length) continue
        d[i] = Math.round(d[i] * 0.7)
        d[i + 1] = Math.round(d[i + 1] * 0.7 + 180 * 0.3)
        d[i + 2] = Math.round(d[i + 2] * 0.7)
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }

  function handleRemoveColor() {
    if (!pickedColor || !imgWidth || !imgHeight) return
    const imageData = currentCleanDataRef.current
    if (!imageData) return
    track('manual_remove', { tolerance })
    pushHistory()
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imgWidth; tmpCanvas.height = imgHeight
    const tmpCtx = tmpCanvas.getContext('2d')!
    tmpCtx.putImageData(imageData, 0, 0)
    floodFillRemove(tmpCtx, lastPickImgXRef.current, lastPickImgYRef.current, tolerance, maskDataArrRef.current)
    const resultData = tmpCtx.getImageData(0, 0, imgWidth, imgHeight)
    currentCleanDataRef.current = resultData
    manualCanvasRef.current?.putImageData(resultData)
    setHasResult(true)
    if (maskVisible) requestAnimationFrame(() => renderMaskOnDisplay())
  }

  function navigateHistory(delta: number) {
    const next = historyIndex + delta
    if (next < 0 || next >= historyRef.current.length) return
    setHistoryIndex(next)
    const frame = historyRef.current[next]
    currentCleanDataRef.current = frame.imageData
    manualCanvasRef.current?.putImageData(frame.imageData)
    maskDataArrRef.current = new Uint8Array(frame.mask)
    if (maskVisible) requestAnimationFrame(() => renderMaskOnDisplay())
  }

  function handleUndo() { navigateHistory(-1) }
  function handleRedo() { navigateHistory(1) }
  function handleClearMask() { pushHistory(); maskDataArrRef.current.fill(0); refreshDisplay() }
  function toggleMaskVisible() { setMaskVisible(v => !v); refreshDisplay() }
  function handleClearPick() { clearPick() }

  function handleDownload() {
    const imageData = currentCleanDataRef.current
    if (!imageData) return
    track('download', { page: 'manual', format: 'png' })
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imgWidth; tmpCanvas.height = imgHeight
    const ctx = tmpCanvas.getContext('2d')!
    ctx.putImageData(imageData, 0, 0)
    const filename = getResultFilename(uploadedImage?.file.name)
    tmpCanvas.toBlob((blob) => { if (blob) downloadBlob(blob, filename) }, 'image/png')
  }

  function handleReset() {
    setUploadedImage(null); setHasResult(false)
    historyRef.current = []; setHistoryIndex(-1); setHistoryLength(0)
    maskDataArrRef.current = new Uint8Array(0)
    setImgWidth(0); setImgHeight(0)
    currentCleanDataRef.current = null; clearPick()
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo() }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); handleRedo() }
      else if (e.key === 'p' || e.key === '1') setToolMode('pick')
      else if (e.key === 'm' || e.key === '2') setToolMode('mask')
      else if (e.key === 'e' || e.key === '3') setToolMode('eraser')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [historyIndex])

  return (
    <div className={styles.pgManual}>

      {/* ── Decorative background ── */}
      <div className={styles.pgBg} aria-hidden="true">
        <div className={styles.pgBgNoise} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb1}`} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb2}`} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb3}`} />
      </div>

      {/* ── Page Header ── */}
      <div className={styles.pgHeader}>
        <div className={`${styles.pghLeft} animate-fade-up`}>
          <div className={styles.pghIcon}>
            <Paintbrush size={18} />
          </div>
          <div>
            <h1 className={styles.pghTitle}>{t('pageTitle')}</h1>
            <p className={styles.pghSub}>{t('pageSub')}</p>
          </div>
        </div>
        <div className={`${styles.pghPills} animate-fade-up delay-100`}>
          <span className={styles.pghPill}><MousePointerClick size={11} />{t('pillColorPick')}</span>
          <span className={styles.pghPill}><Shield size={11} />{t('pillMaskProtect')}</span>
          <span className={styles.pghPill}><Undo2 size={11} />{t('pillUnlimitedUndo')}</span>
        </div>
      </div>

      {/* ── Upload state ── */}
      {!uploadedImage ? (
        <div className="animate-fade-up delay-150">
          <ImageUploader onUpload={onUpload} />
        </div>
      ) : (
        /* ── Editor state ── */
        <div className={`animate-fade-up delay-150 ${styles.editorGrid}`}>
          {/* Left: Canvas + controls */}
          <div className={styles.editorMain}>
            <ToolBar
              toolMode={toolMode}
              onToolModeChange={setToolMode}
              canUndo={canUndo}
              canRedo={canRedo}
              maskVisible={maskVisible}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearMask={handleClearMask}
              onToggleMaskVisible={toggleMaskVisible}
            />

            <div className={styles.canvasFrame}>
              <ManualCanvas
                ref={manualCanvasRef}
                toolMode={toolMode}
                brushSize={brushSize}
                tolerance={tolerance}
                maskVisible={maskVisible}
                onCanvasClick={onCanvasClick}
                onBrushPaint={onBrushPaint}
                onHoverUpdate={onHoverUpdate}
                onImageLoaded={onImageLoaded}
              />
            </div>

            {/* Color Picker bar */}
            <div className={styles.panelCard}>
              <div className={styles.pcHeader}>
                <div className={`${styles.pcIcon} ${styles.pcIconOrange}`}><Pipette size={11} /></div>
                <span className={styles.pcLabel}>{t('pickedColor')}</span>
              </div>
              <ColorPicker
                pickedColor={pickedColor}
                onRemove={handleRemoveColor}
                onClear={handleClearPick}
              />
            </div>

            {/* Action buttons */}
            <div className={styles.actionRow}>
              <button className="flex-1 btn btn-secondary btn-md" onClick={handleReset}>
                <RefreshCcw size={14} />
                {tc('reUpload')}
              </button>
              <button className="flex-1 btn btn-primary btn-md" disabled={!hasResult} onClick={handleDownload}>
                <Download size={14} />
                {tc('downloadPng')}
              </button>
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className={styles.editorSidebar}>
            <div className={styles.panelCard}>
              <div className={styles.pcHeader}>
                <div className={styles.pcIcon}><SlidersHorizontal size={11} /></div>
                <span className={styles.pcLabel}>{t('fillSettings')}</span>
              </div>
              <ToleranceSlider value={tolerance} onChange={setTolerance} />
            </div>

            {(toolMode === 'mask' || toolMode === 'eraser') && (
              <div className={styles.panelCard}>
                <div className={styles.pcHeader}>
                  <div className={`${styles.pcIcon} ${toolMode === 'mask' ? styles.pcIconGreen : ''}`}>
                    <Circle size={11} />
                  </div>
                  <span className={styles.pcLabel}>{toolMode === 'mask' ? t('protectBrush') : t('eraser')}</span>
                </div>
                <MaskBrush value={brushSize} onChange={setBrushSize} />
              </div>
            )}

            <div className={styles.panelCard}>
              <div className={styles.pcHeader}>
                <div className={`${styles.pcIcon} ${styles.pcIconIndigo}`}><Info size={11} /></div>
                <span className={styles.pcLabel}>{t('guideTitle')}</span>
              </div>
              <ol className={styles.guideList}>
                {instructions.map((step, i) => (
                  <li key={i}>
                    <span className={`${styles.glNum} ${styles[step.color]}`}>{i + 1}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={`${styles.panelCard} ${styles.panelCardMuted}`}>
              <div className={styles.pcHeader}>
                <div className={styles.pcIcon}><Keyboard size={11} /></div>
                <span className={styles.pcLabel}>{t('shortcutsTitle')}</span>
              </div>
              <div className={styles.kbList}>
                {shortcuts.map((kb) => (
                  <div key={kb.key} className={styles.kbRow}>
                    <span className={styles.kbLabel}>{kb.label}</span>
                    <kbd className={styles.kbKey}>{kb.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
