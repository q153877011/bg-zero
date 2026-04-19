'use client'

import { useState, useCallback, useRef } from 'react'
import { rgbToHex } from '@/lib/utils/color'

export interface PickedColor {
  r: number
  g: number
  b: number
  hex: string
}

export function useColorPicker() {
  const [pickedColor, setPickedColor] = useState<PickedColor | null>(null)
  const [hoverColor, setHoverColor] = useState<PickedColor | null>(null)
  const lastHoverRef = useRef({ x: -1, y: -1 })

  const pickFromCanvas = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number): PickedColor => {
    const data = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      hex: rgbToHex(data[0], data[1], data[2]),
    }
  }, [])

  const confirmPick = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    setPickedColor(pickFromCanvas(ctx, x, y))
  }, [pickFromCanvas])

  const updateHover = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    if (ix === lastHoverRef.current.x && iy === lastHoverRef.current.y) return
    lastHoverRef.current = { x: ix, y: iy }
    setHoverColor(pickFromCanvas(ctx, x, y))
  }, [pickFromCanvas])

  const clearHover = useCallback(() => {
    lastHoverRef.current = { x: -1, y: -1 }
    setHoverColor(null)
  }, [])

  const clearPick = useCallback(() => {
    setPickedColor(null)
  }, [])

  return {
    pickedColor,
    hoverColor,
    confirmPick,
    updateHover,
    clearHover,
    clearPick,
  }
}
