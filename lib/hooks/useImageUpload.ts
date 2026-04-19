'use client'

import { useState, useCallback } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']
const MAX_SIZE_MB = 25
const MAX_PIXELS = 16_000_000

export interface UploadedImage {
  file: File
  dataUrl: string
  width: number
  height: number
  sizeKB: number
}

export function useImageUpload() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { track } = useAnalytics()

  const processFile = useCallback(async (file: File): Promise<void> => {
    setUploadError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Unsupported format: ${file.type || 'unknown'}. Please upload JPG, PNG, WebP or BMP.`)
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      setUploadError(`File too large (${sizeMB.toFixed(1)}MB). Please upload an image under ${MAX_SIZE_MB}MB.`)
      return
    }

    setIsLoading(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      const dims = await getImageDimensions(dataUrl)

      if (dims.width * dims.height > MAX_PIXELS) {
        const mp = (dims.width * dims.height / 1_000_000).toFixed(1)
        setUploadError(`Image resolution too high (${dims.width}×${dims.height}, ${mp}MP). Please upload an image under 16MP.`)
        return
      }

      const image: UploadedImage = {
        file,
        dataUrl,
        width: dims.width,
        height: dims.height,
        sizeKB: Math.round(file.size / 1024),
      }
      setUploadedImage(image)

      const ext = file.name.split('.').pop()?.toLowerCase() || file.type.split('/')[1] || 'unknown'
      track('image_upload', {
        size_kb: Math.round(file.size / 1024),
        format: ext,
        width: dims.width,
        height: dims.height,
      })
    } catch {
      setUploadError('Failed to read image, please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [track])

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target!.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = reject
      img.src = dataUrl
    })
  }

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) await processFile(file)
  }, [processFile])

  const onPaste = useCallback(async (e: ClipboardEvent) => {
    const file = Array.from(e.clipboardData?.items ?? [])
      .find(i => i.type.startsWith('image/'))
      ?.getAsFile()
    if (file) await processFile(file)
  }, [processFile])

  const clearImage = useCallback(() => {
    setUploadedImage(null)
    setUploadError(null)
  }, [])

  return {
    uploadedImage,
    isDragging,
    uploadError,
    isLoading,
    processFile,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onPaste,
    clearImage,
  }
}
