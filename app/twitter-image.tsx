import { ImageResponse } from 'next/og'

// Twitter/X card image (same design as OG, slightly different dimensions would be an option)
// Next.js serves this at /twitter-image.png automatically.
export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }
export const alt = 'BG-Zero — Remove image backgrounds in your browser'

export { default } from './opengraph-image'
