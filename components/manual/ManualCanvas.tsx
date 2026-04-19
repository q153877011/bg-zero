'use client'

import { useTranslations } from 'next-intl'
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { loadImageFromBlob, displayToImageCoords } from '@/lib/utils/canvas'
import type { PickedColor } from '@/lib/hooks/useColorPicker'
import styles from './ManualCanvas.module.css'

export type ToolMode = 'pick' | 'mask' | 'eraser'

interface ManualCanvasProps {
  toolMode: ToolMode
  brushSize: number
  tolerance: number
  maskVisible: boolean
  onCanvasClick?: (x: number, y: number, imageX: number, imageY: number) => void
  onBrushPaint?: (imageX: number, imageY: number, erase: boolean) => void
  onHoverUpdate?: (imageX: number, imageY: number) => void
  onImageLoaded?: (width: number, height: number) => void
}

export interface ManualCanvasHandle {
  canvasRef: HTMLCanvasElement | null
  loadImage: (blob: Blob) => Promise<void>
  getCtx: () => CanvasRenderingContext2D | null
  getImageData: () => ImageData | null
  putImageData: (imageData: ImageData) => void
  toBlob: () => Promise<Blob | null>
  redrawFromSource: (maskDataArr?: Uint8Array | null) => void
  setHoverColor: (color: PickedColor | null) => void
  drawScale: number
  drawOffsetX: number
  drawOffsetY: number
  imageWidth: number
  imageHeight: number
}

const ManualCanvas = forwardRef<ManualCanvasHandle, ManualCanvasProps>(function ManualCanvas(
  { toolMode, brushSize, tolerance, maskVisible, onCanvasClick, onBrushPaint, onHoverUpdate, onImageLoaded },
  ref
) {
  const t = useTranslations('manual')
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [containerHeight, setContainerHeight] = useState(400)
  const [canvasWidth, setCanvasWidth] = useState(800)
  const [canvasHeight, setCanvasHeight] = useState(400)
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)
  const [hasImage, setHasImage] = useState(false)

  const [drawScale, setDrawScale] = useState(1)
  const [drawOffsetX, setDrawOffsetX] = useState(0)
  const [drawOffsetY, setDrawOffsetY] = useState(0)

  const [isDrawing, setIsDrawing] = useState(false)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [hoverColor, setHoverColor] = useState<PickedColor | null>(null)
  const [brushCursorPos, setBrushCursorPos] = useState<{ x: number; y: number } | null>(null)

  const sourceImgRef = useRef<HTMLImageElement | null>(null)

  // Canvas cursor class
  const canvasCursorClass = useMemo(() => {
    if (toolMode === 'pick') return styles.cursorCrosshair
    if (toolMode === 'mask' || toolMode === 'eraser') return styles.cursorNone
    return styles.cursorDefault
  }, [toolMode])

  // Hover indicator style
  const hoverIndicatorStyle = useMemo(() => {
    if (!hoverPos) return undefined
    const { x, y } = hoverPos
    const container = containerRef.current
    if (!container) return undefined
    const rect = container.getBoundingClientRect()
    const offsetX = x + 140 > rect.width ? x - 148 : x + 14
    const offsetY = y - 30 < 0 ? y + 8 : y - 30
    return { left: offsetX + 'px', top: offsetY + 'px' } as React.CSSProperties
  }, [hoverPos])

  // Brush cursor style
  const brushCursorStyle = useMemo(() => {
    if (!brushCursorPos) return undefined
    const size = brushSize * drawScale
    const { x, y } = brushCursorPos
    return {
      width: size + 'px',
      height: size + 'px',
      left: (x - size / 2) + 'px',
      top: (y - size / 2) + 'px',
    } as React.CSSProperties
  }, [brushCursorPos, brushSize, drawScale])

  // Helper: get ctx
  const getCtx = useCallback((): CanvasRenderingContext2D | null => {
    return canvasRef.current?.getContext('2d') ?? null
  }, [])

  // Helper: canvas XY from mouse/touch event
  const getCanvasXY = useCallback((e: React.MouseEvent | React.Touch | MouseEvent | Touch): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = canvasWidth / rect.width
    const scaleY = canvasHeight / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [canvasWidth, canvasHeight])

  // Helper: image XY
  const getImageXY = useCallback((canvasX: number, canvasY: number) => {
    return displayToImageCoords(canvasX, canvasY, drawScale, drawOffsetX, drawOffsetY)
  }, [drawScale, drawOffsetX, drawOffsetY])

  // Helper: within image bounds
  const isWithinImage = useCallback((imgX: number, imgY: number) => {
    return imgX >= 0 && imgX < imageWidth && imgY >= 0 && imgY < imageHeight
  }, [imageWidth, imageHeight])

  // Load image
  const loadImage = useCallback(async (blob: Blob) => {
    const img = await loadImageFromBlob(blob)
    sourceImgRef.current = img
    setImageWidth(img.naturalWidth)
    setImageHeight(img.naturalHeight)

    // Wait for next frame for container measurement
    await new Promise((r) => requestAnimationFrame(r))

    const containerW = containerRef.current?.clientWidth ?? 600
    const containerH = Math.min(containerW * 0.75, 500)
    setContainerHeight(containerH)
    setCanvasWidth(containerW)
    setCanvasHeight(containerH)

    // Wait for canvas resize
    await new Promise((r) => requestAnimationFrame(r))

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const scale = Math.min(containerW / img.naturalWidth, containerH / img.naturalHeight, 1)
    const drawW = img.naturalWidth * scale
    const drawH = img.naturalHeight * scale
    const oX = (containerW - drawW) / 2
    const oY = (containerH - drawH) / 2

    setDrawScale(scale)
    setDrawOffsetX(oX)
    setDrawOffsetY(oY)

    ctx.clearRect(0, 0, containerW, containerH)
    ctx.drawImage(img, oX, oY, drawW, drawH)

    setHasImage(true)
    onImageLoaded?.(img.naturalWidth, img.naturalHeight)
  }, [onImageLoaded])

  // Redraw from source
  const redrawFromSource = useCallback((_maskDataArr?: Uint8Array | null) => {
    const img = sourceImgRef.current
    if (!img) return
    const ctx = getCtx()
    if (!ctx) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, drawOffsetX, drawOffsetY, img.naturalWidth * drawScale, img.naturalHeight * drawScale)
  }, [getCtx, canvasWidth, canvasHeight, drawOffsetX, drawOffsetY, drawScale])

  // Put image data
  const putImageData = useCallback((imageData: ImageData) => {
    const ctx = getCtx()
    if (!ctx) return
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imageData.width
    tmpCanvas.height = imageData.height
    const tmpCtx = tmpCanvas.getContext('2d')!
    tmpCtx.putImageData(imageData, 0, 0)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(tmpCanvas, drawOffsetX, drawOffsetY, imageData.width * drawScale, imageData.height * drawScale)
  }, [getCtx, canvasWidth, canvasHeight, drawOffsetX, drawOffsetY, drawScale])

  // Get image data
  const getImageData = useCallback((): ImageData | null => {
    const ctx = getCtx()
    if (!ctx || !hasImage) return null
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imageWidth
    tmpCanvas.height = imageHeight
    const tmpCtx = tmpCanvas.getContext('2d')!
    tmpCtx.drawImage(
      canvasRef.current!,
      drawOffsetX, drawOffsetY,
      imageWidth * drawScale,
      imageHeight * drawScale,
      0, 0,
      imageWidth,
      imageHeight
    )
    return tmpCtx.getImageData(0, 0, imageWidth, imageHeight)
  }, [getCtx, hasImage, imageWidth, imageHeight, drawOffsetX, drawOffsetY, drawScale])

  // To blob
  const toBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const tmpCanvas = document.createElement('canvas')
      tmpCanvas.width = imageWidth
      tmpCanvas.height = imageHeight
      const tmpCtx = tmpCanvas.getContext('2d')!
      tmpCtx.drawImage(
        canvasRef.current!,
        drawOffsetX, drawOffsetY,
        imageWidth * drawScale,
        imageHeight * drawScale,
        0, 0,
        imageWidth,
        imageHeight
      )
      tmpCanvas.toBlob(resolve, 'image/png')
    })
  }, [imageWidth, imageHeight, drawOffsetX, drawOffsetY, drawScale])

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    canvasRef: canvasRef.current,
    loadImage,
    getCtx,
    getImageData,
    putImageData,
    toBlob,
    redrawFromSource,
    setHoverColor: (color: PickedColor | null) => setHoverColor(color),
    drawScale,
    drawOffsetX,
    drawOffsetY,
    imageWidth,
    imageHeight,
  }), [loadImage, getCtx, getImageData, putImageData, toBlob, redrawFromSource, drawScale, drawOffsetX, drawOffsetY, imageWidth, imageHeight])

  // ---- Mouse/Touch Events ----
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return
    const { x, y } = getCanvasXY(e)
    const { x: imgX, y: imgY } = getImageXY(x, y)
    if (!isWithinImage(imgX, imgY)) return

    if (toolMode === 'pick') {
      onCanvasClick?.(x, y, imgX, imgY)
    } else {
      setIsDrawing(true)
      onBrushPaint?.(imgX, imgY, toolMode === 'eraser')
    }
  }, [hasImage, getCanvasXY, getImageXY, isWithinImage, toolMode, onCanvasClick, onBrushPaint])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return
    const { x, y } = getCanvasXY(e)
    const { x: imgX, y: imgY } = getImageXY(x, y)

    if (toolMode === 'pick' && isWithinImage(imgX, imgY)) {
      setHoverPos({ x, y })
      onHoverUpdate?.(imgX, imgY)
    } else {
      setHoverPos(null)
    }

    if (toolMode === 'mask' || toolMode === 'eraser') {
      setBrushCursorPos({ x, y })
    }

    if (isDrawing && isWithinImage(imgX, imgY)) {
      onBrushPaint?.(imgX, imgY, toolMode === 'eraser')
    }
  }, [hasImage, getCanvasXY, getImageXY, isWithinImage, toolMode, isDrawing, onHoverUpdate, onBrushPaint])

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverPos(null)
    setBrushCursorPos(null)
    setIsDrawing(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0]
    if (!touch || !hasImage) return
    const { x, y } = getCanvasXY(touch)
    const { x: imgX, y: imgY } = getImageXY(x, y)
    if (!isWithinImage(imgX, imgY)) return
    if (toolMode === 'pick') {
      onCanvasClick?.(x, y, imgX, imgY)
    } else {
      setIsDrawing(true)
      onBrushPaint?.(imgX, imgY, toolMode === 'eraser')
    }
  }, [hasImage, getCanvasXY, getImageXY, isWithinImage, toolMode, onCanvasClick, onBrushPaint])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0]
    if (!touch || !hasImage || !isDrawing) return
    const { x, y } = getCanvasXY(touch)
    const { x: imgX, y: imgY } = getImageXY(x, y)
    if (isWithinImage(imgX, imgY)) {
      onBrushPaint?.(imgX, imgY, toolMode === 'eraser')
    }
  }, [hasImage, isDrawing, getCanvasXY, getImageXY, isWithinImage, toolMode, onBrushPaint])

  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false)
  }, [])

  return (
    <div className="relative select-none">
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className={styles.container}
        style={{ height: containerHeight + 'px' }}
      >
        {/* Checkerboard background */}
        <div className={styles.checkerboard} />

        {/* Main canvas */}
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${canvasCursorClass}`}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Color hover indicator (eyedropper mode) */}
        {toolMode === 'pick' && hoverPos && hoverColor && (
          <div className={styles.hoverIndicator} style={hoverIndicatorStyle}>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[rgba(28,25,23,0.1)] shadow-[var(--shadow-sm)] text-[11px] font-mono text-[var(--text-primary)] whitespace-nowrap">
              <div
                className="w-3 h-3 rounded-sm border border-[rgba(28,25,23,0.15)] flex-shrink-0"
                style={{ background: hoverColor.hex }}
              />
              {hoverColor.hex}
            </div>
          </div>
        )}

        {/* Brush cursor overlay (mask/eraser mode) */}
        {(toolMode === 'mask' || toolMode === 'eraser') && brushCursorPos && (
          <div
            className={`${styles.brushCursor} ${toolMode === 'mask' ? styles.brushCursorMask : styles.brushCursorEraser}`}
            style={brushCursorStyle}
          />
        )}

        {/* Empty state */}
        {!hasImage && (
          <div className={styles.emptyState}>
            <p className="text-[13px] text-[var(--text-tertiary)]">{t('emptyCanvasHint')}</p>
          </div>
        )}
      </div>

      {/* Canvas info bar */}
      {hasImage && (
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[11px] text-[var(--text-tertiary)]">{imageWidth} × {imageHeight} px</span>
          {toolMode === 'pick' && hoverColor && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm border border-[rgba(28,25,23,0.1)]"
                style={{ background: hoverColor.hex }}
              />
              <span className="text-[11px] font-mono text-[var(--text-tertiary)]">{hoverColor.hex}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default ManualCanvas
