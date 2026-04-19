/**
 * lib/hooks/useDownload.ts
 * 下载处理结果
 */

export function useDownload() {
  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  function downloadCanvas(canvas: HTMLCanvasElement, filename = 'bg-zero-result.png') {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename)
    }, 'image/png')
  }

  function getResultFilename(originalName?: string): string {
    const base = originalName?.replace(/\.[^.]+$/, '') ?? 'image'
    return `${base}-bg-removed.png`
  }

  return { downloadBlob, downloadCanvas, getResultFilename }
}
