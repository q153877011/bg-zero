/**
 * utils/browser.ts — 浏览器能力检测
 */

export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu
}

export function isOffscreenCanvasAvailable(): boolean {
  return typeof OffscreenCanvas !== 'undefined'
}

export function isSharedArrayBufferAvailable(): boolean {
  try {
    return typeof SharedArrayBuffer !== 'undefined'
  } catch {
    return false
  }
}

export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  if (!('gpu' in navigator)) return false
  try {
    const adapter = await (navigator as any).gpu.requestAdapter()
    return adapter !== null
  } catch {
    return false
  }
}

export function getBrowserInfo(): { name: string; version: string } {
  if (typeof navigator === 'undefined') return { name: 'Unknown', version: '' }
  const ua = navigator.userAgent

  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/(\d+)/)
    return { name: 'Edge', version: match?.[1] ?? '' }
  }
  if (ua.includes('Chrome/') && !ua.includes('Chromium/')) {
    const match = ua.match(/Chrome\/(\d+)/)
    return { name: 'Chrome', version: match?.[1] ?? '' }
  }
  if (ua.includes('Firefox/')) {
    const match = ua.match(/Firefox\/(\d+)/)
    return { name: 'Firefox', version: match?.[1] ?? '' }
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    const match = ua.match(/Version\/(\d+)/)
    return { name: 'Safari', version: match?.[1] ?? '' }
  }
  return { name: 'Browser', version: '' }
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export async function estimateAvailableMemoryMB(): Promise<number | null> {
  try {
    if ('deviceMemory' in navigator) {
      return ((navigator as any).deviceMemory ?? 4) * 1024
    }
    return null
  } catch {
    return null
  }
}
