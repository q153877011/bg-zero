'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * 蒙版保护画笔工具
 */
export function useProtectMask(width: number, height: number) {
  const maskDataRef = useRef(new Uint8Array(width * height))
  const [brushSize, setBrushSize] = useState(20)
  const [brushHardness, setBrushHardness] = useState(0.8)
  const [maskVisible, setMaskVisible] = useState(true)

  const paintAt = useCallback((cx: number, cy: number, erase = false) => {
    const radius = brushSize / 2
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > radius) continue
        const px = Math.round(cx + dx)
        const py = Math.round(cy + dy)
        if (px < 0 || px >= width || py < 0 || py >= height) continue
        maskDataRef.current[py * width + px] = erase ? 0 : 1
      }
    }
  }, [brushSize, width, height])

  const clearMask = useCallback(() => {
    maskDataRef.current.fill(0)
  }, [])

  const hasMask = useCallback((): boolean => {
    return maskDataRef.current.some(v => v === 1)
  }, [])

  const renderMaskOverlay = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!maskVisible) return
    const imageData = ctx.getImageData(0, 0, width, height)
    for (let i = 0; i < maskDataRef.current.length; i++) {
      if (maskDataRef.current[i]) {
        const idx = i * 4
        const alpha = 80 / 255
        imageData.data[idx]     = Math.round(imageData.data[idx] * (1 - alpha) + 0 * alpha)
        imageData.data[idx + 1] = Math.round(imageData.data[idx + 1] * (1 - alpha) + 200 * alpha)
        imageData.data[idx + 2] = Math.round(imageData.data[idx + 2] * (1 - alpha) + 0 * alpha)
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }, [maskVisible, width, height])

  return {
    maskData: maskDataRef.current,
    brushSize,
    setBrushSize,
    brushHardness,
    setBrushHardness,
    maskVisible,
    setMaskVisible,
    paintAt,
    clearMask,
    hasMask,
    renderMaskOverlay,
  }
}
