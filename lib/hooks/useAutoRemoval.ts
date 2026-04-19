'use client'

/**
 * lib/hooks/useAutoRemoval.ts
 * 统一三引擎接口 + 动态 import 按需加载
 */

import { useState, useCallback } from 'react'
import type { EngineType } from '@/lib/hooks/useEnginePreference'
import { useEnginePreference } from '@/lib/hooks/useEnginePreference'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { isWebGPUAvailable, isOffscreenCanvasAvailable, isSharedArrayBufferAvailable } from '@/lib/utils/browser'

export type { EngineType } from '@/lib/hooks/useEnginePreference'

export interface RemovalEngine {
  name: EngineType
  process(image: File | Blob, onProgress?: (p: number) => void): Promise<Blob>
}

export const REMBG_MODELS = [
  { id: 'u2netp',             label: 'u2netp',           size: '4.7MB',  speed: '~950ms',  desc: '极速预览', recommended: true },
  { id: 'silueta',            label: 'silueta',          size: '44MB',   speed: '~2s',     desc: '背景优化' },
  { id: 'u2net_human_seg',    label: 'u2net_human_seg',  size: '44MB',   speed: '~2s',     desc: '人像专用' },
  { id: 'isnet-general-use',  label: 'isnet-general',    size: '44MB',   speed: '~7s',     desc: '高精度通用' },
  { id: 'isnet-anime',        label: 'isnet-anime',      size: '44MB',   speed: '~3s',     desc: '动漫专用' },
  { id: 'u2net',              label: 'u2net',            size: '176MB',  speed: '~2.6s',   desc: '通用完整版' },
] as const

export type RembgModel = typeof REMBG_MODELS[number]['id']

// Module-level singleton cache — survives route changes so models aren't re-downloaded
const _loadedEngines = new Map<string, RemovalEngine>()

export function useAutoRemoval() {
  const { load: loadPref, save: savePref } = useEnginePreference()
  const { track } = useAnalytics()

  const MODEL_CDN = process.env.NEXT_PUBLIC_MODEL_CDN_URL || ''

  const savedPref = loadPref()
  const [currentEngine, setCurrentEngine] = useState<EngineType>(savedPref.engine)
  const [selectedRembgModel, setSelectedRembgModel] = useState<RembgModel>((savedPref.rembgModel as RembgModel) ?? 'u2netp')

  const [isLoadingEngine, setIsLoadingEngine] = useState(false)
  const [engineLoadProgress, setEngineLoadProgress] = useState(0)
  const [engineLoadText, setEngineLoadText] = useState('')

  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)

  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const webGPUAvailable = isWebGPUAvailable()
  const sharedArrayBufferAvailable = isSharedArrayBufferAvailable()

  async function loadImgly(): Promise<RemovalEngine> {
    setEngineLoadText('Loading imgly engine...')
    setEngineLoadProgress(0)
    const mod = await import('@imgly/background-removal')
    setEngineLoadProgress(100)
    return {
      name: 'imgly',
      async process(image, onProgress) {
        const result = await mod.removeBackground(image as Blob, {
          progress: (_key: string, current: number, total: number) => {
            onProgress?.(total > 0 ? current / total : 0)
          },
          model: 'isnet_fp16',
          // Only set publicPath if CDN has onnxruntime-web WASM files uploaded
          ...(MODEL_CDN ? { publicPath: `${MODEL_CDN}/imgly/` } : {}),
        })
        return result
      },
    }
  }

  async function loadTransformers(): Promise<RemovalEngine> {
    if (!isOffscreenCanvasAvailable()) {
      throw new Error('Your browser does not support OffscreenCanvas. Cannot use Transformers.js engine. Please use imgly or rembg-web instead.')
    }

    setEngineLoadText('Loading Transformers.js engine...')
    setEngineLoadProgress(0)
    const { pipeline, env } = await import('@huggingface/transformers')
    setEngineLoadText('Downloading RMBG-1.4 model (~176MB)... First load may take a few minutes, please wait')

    if (MODEL_CDN) {
      env.remoteHost = `${MODEL_CDN}/transformers/`
      env.remotePathTemplate = '{model}/'
      env.allowLocalModels = false
    }

    const device = isWebGPUAvailable() ? 'webgpu' : 'wasm'

    let segmenter: any
    try {
      segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
        device,
        dtype: 'fp32',
        progress_callback: (progress: any) => {
          if (progress?.status === 'progress' && progress?.total > 0) {
            setEngineLoadProgress(Math.round((progress.loaded / progress.total) * 100))
          } else if (progress?.status === 'done') {
            setEngineLoadProgress(100)
          }
        },
      } as any)
    } catch (e: any) {
      console.error('[Transformers.js] pipeline() failed:', e)
      throw e
    }

    return {
      name: 'transformers',
      async process(image, onProgress) {
        onProgress?.(0.1)
        const url = URL.createObjectURL(image as Blob)
        onProgress?.(0.3)
        try {
          const results: any[] = await (segmenter as any)(url)
          onProgress?.(0.9)
          const result = results?.[0]
          if (!result?.mask) throw new Error('No mask returned')

          // In Transformers.js 4.1, result.mask is a RawImage object (not a data URL)
          const mask = result.mask
          const img = await createImageBitmap(image as Blob)
          const canvas = new OffscreenCanvas(img.width, img.height)
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, img.width, img.height)

          // mask.data is Uint8ClampedArray, mask.channels is 1 (grayscale)
          // Resize mask to match image dimensions if needed
          const maskResized = (mask.width !== img.width || mask.height !== img.height)
            ? await mask.resize(img.width, img.height)
            : mask

          for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i + 3] = maskResized.data[i / 4 * maskResized.channels]
          }
          ctx.putImageData(imgData, 0, 0)
          onProgress?.(1)
          return await canvas.convertToBlob({ type: 'image/png' })
        } finally {
          URL.revokeObjectURL(url)
        }
      },
    }
  }

  async function loadRembgWeb(modelId: RembgModel): Promise<RemovalEngine> {
    setEngineLoadText(`Loading rembg-web (${modelId})...`)
    setEngineLoadProgress(0)
    const mod = await import('@bunnio/rembg-web')

    if (MODEL_CDN) {
      mod.rembgConfig.setBaseUrl(`${MODEL_CDN}/rembg-web`)
    }

    setEngineLoadProgress(100)
    return {
      name: 'rembg-web',
      async process(image, onProgress) {
        const result = await (mod as any).remove(image as Blob, {
          model: modelId,
          postProcessMask: true,
          onProgress: (info: any) => {
            onProgress?.((info?.progress ?? 0) / 100)
          },
        })
        return result as Blob
      },
    }
  }

  function getEngineKey(engine: EngineType, model?: RembgModel): string {
    return engine === 'rembg-web' ? `rembg-web:${model ?? selectedRembgModel}` : engine
  }

  function friendlyError(e: any): string {
    if (!e) return 'Unknown error, please try again.'
    const msg: string = e?.message ?? String(e)
    if (msg.startsWith('Your browser') || msg.startsWith('Image')) return msg
    if (msg.includes('WebGPU') || msg.includes('gpu')) return 'Your browser does not support WebGPU. Auto-switched to CPU mode. If errors persist, use imgly engine.'
    if (msg.includes('SharedArrayBuffer')) return 'Browser security restrictions prevented multi-thread acceleration. Please ensure COOP/COEP headers are enabled, or try another engine.'
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) return 'Model download failed. Please check your network connection and try again.'
    if (msg.includes('memory') || msg.includes('OOM') || msg.includes('out of memory')) return 'Out of memory. Please close other tabs and try again, or upload a smaller image.'
    return 'Engine loading failed. Please try again or switch to another engine.'
  }

  const switchEngine = useCallback(async (engine: EngineType, model?: RembgModel) => {
    if (model) setSelectedRembgModel(model)
    const key = getEngineKey(engine, model)
    const previousEngine = currentEngine

    if (!_loadedEngines.has(key)) {
      setIsLoadingEngine(true)
      setEngineLoadProgress(0)
      setError(null)
      try {
        let eng: RemovalEngine
        if (engine === 'imgly') {
          eng = await loadImgly()
        } else if (engine === 'transformers') {
          eng = await loadTransformers()
        } else {
          eng = await loadRembgWeb((model ?? selectedRembgModel) as RembgModel)
        }
        _loadedEngines.set(key, eng)
      } catch (e: any) {
        setError(friendlyError(e))
        setIsLoadingEngine(false)
        return
      }
      setIsLoadingEngine(false)
    }

    setCurrentEngine(engine)
    savePref({ engine, rembgModel: model ?? selectedRembgModel })

    if (previousEngine !== engine) {
      track('engine_switch', { from: previousEngine, to: engine })
    }
  }, [currentEngine, selectedRembgModel, savePref, track])

  const processImage = useCallback(async (imageFile: File) => {
    setError(null)
    setResultBlob(null)
    setProcessProgress(0)

    const key = getEngineKey(currentEngine)

    if (!_loadedEngines.has(key)) {
      await switchEngine(currentEngine)
      // Check if error occurred during engine load
      // We can't check error state directly due to async, so check the map
      if (!_loadedEngines.has(key)) return
    }

    const engine = _loadedEngines.get(key)!
    setIsProcessing(true)
    const startTime = Date.now()
    track('process_start', { page: 'auto', engine: currentEngine })
    try {
      const blob = await engine.process(imageFile, (p) => {
        setProcessProgress(Math.round(p * 100))
      })
      setResultBlob(blob)
      setProcessProgress(100)
      track('process_done', { page: 'auto', engine: currentEngine, duration_ms: Date.now() - startTime })
    } catch (e: any) {
      const errMsg = friendlyError(e)
      setError(errMsg)
      track('process_error', { page: 'auto', engine: currentEngine, error: errMsg })
    } finally {
      setIsProcessing(false)
    }
  }, [currentEngine, switchEngine, track])

  const clearResult = useCallback(() => {
    setResultBlob(null)
    setProcessProgress(0)
    setError(null)
  }, [])

  return {
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
    process: processImage,
    clearResult,
    REMBG_MODELS,
    webGPUAvailable,
    sharedArrayBufferAvailable,
  }
}
