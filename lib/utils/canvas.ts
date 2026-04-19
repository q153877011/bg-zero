/**
 * utils/canvas.ts — Canvas 工具函数 & Flood Fill 算法
 */

/**
 * 从 File/Blob 创建 HTMLImageElement
 */
export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * 将 HTMLImageElement 绘制到离屏 Canvas，返回 ctx
 */
export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return canvas
}

/**
 * 将 Canvas 转换为 Blob（PNG）
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas toBlob failed'))
    }, type, quality)
  })
}

/**
 * 颜色欧氏距离
 */
export function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * Flood Fill 背景去除（BFS + 颜色容差 + 蒙版保护）
 *
 * @param ctx          - 目标 CanvasRenderingContext2D
 * @param startX       - 起始 X（图像坐标）
 * @param startY       - 起始 Y（图像坐标）
 * @param tolerance    - 颜色容差 0–255（推荐 0–100）
 * @param protectMask  - Uint8Array，长度 = width * height，1 = 受保护
 * @returns            修改后的 ImageData（已写回 ctx）
 */
export function floodFillRemove(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  tolerance: number,
  protectMask: Uint8Array
): ImageData {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData

  // 起始点颜色
  const startIdx = (startY * width + startX) * 4
  const targetR = data[startIdx]
  const targetG = data[startIdx + 1]
  const targetB = data[startIdx + 2]

  // 跳过已完全透明的像素
  if (data[startIdx + 3] === 0) {
    return imageData
  }

  const totalPixels = width * height
  const visited = new Uint8Array(totalPixels)
  const queue = new Uint32Array(totalPixels)
  let head = 0, tail = 0

  queue[tail++] = startY * width + startX

  while (head < tail) {
    const pixelIdx = queue[head++]

    if (visited[pixelIdx]) continue
    visited[pixelIdx] = 1

    const x = pixelIdx % width
    const y = (pixelIdx / width) | 0
    const idx = pixelIdx * 4

    // 跳过受保护像素（不去除，但继续扩散检查）
    if (protectMask[pixelIdx]) continue

    // 颜色距离检测
    const distance = colorDistance(
      data[idx], data[idx + 1], data[idx + 2],
      targetR, targetG, targetB
    )

    if (distance <= tolerance) {
      data[idx + 3] = 0 // 设为透明

      // 向四个方向扩展
      if (x > 0 && !visited[pixelIdx - 1])       queue[tail++] = pixelIdx - 1
      if (x < width - 1 && !visited[pixelIdx + 1]) queue[tail++] = pixelIdx + 1
      if (y > 0 && !visited[pixelIdx - width])     queue[tail++] = pixelIdx - width
      if (y < height - 1 && !visited[pixelIdx + width]) queue[tail++] = pixelIdx + width
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return imageData
}

/**
 * 获取 Canvas 某点像素颜色
 */
export function getPixelColor(ctx: CanvasRenderingContext2D, x: number, y: number): { r: number; g: number; b: number; a: number } {
  const data = ctx.getImageData(x, y, 1, 1).data
  return { r: data[0], g: data[1], b: data[2], a: data[3] }
}

/**
 * 以 display 尺寸绘制图片到 Canvas（保持比例 fit-contain）
 */
export function drawImageFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  displayWidth: number,
  displayHeight: number
) {
  const naturalW = img instanceof HTMLImageElement ? img.naturalWidth : img.width
  const naturalH = img instanceof HTMLImageElement ? img.naturalHeight : img.height
  const scale = Math.min(displayWidth / naturalW, displayHeight / naturalH, 1)
  const drawW = naturalW * scale
  const drawH = naturalH * scale
  const offsetX = (displayWidth - drawW) / 2
  const offsetY = (displayHeight - drawH) / 2
  ctx.clearRect(0, 0, displayWidth, displayHeight)
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  return { scale, offsetX, offsetY, drawW, drawH }
}

/**
 * display 坐标 → 图像原始坐标
 */
export function displayToImageCoords(
  displayX: number,
  displayY: number,
  scale: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  return {
    x: Math.round((displayX - offsetX) / scale),
    y: Math.round((displayY - offsetY) / scale),
  }
}
