/**
 * public/model-cache-sw.js
 * Service Worker that caches AI model files (ONNX, WASM, binary weights)
 * so they don't re-download on every visit.
 *
 * Strategy: Cache-first for model files, network-first for everything else.
 */

const CACHE_NAME = 'bg-zero-models-v1'

// Patterns that identify model/WASM binary downloads
const MODEL_PATTERNS = [
  /\.onnx$/i,
  /\.ort$/i,
  /\.wasm$/i,
  /\.bin$/i,
  /onnxruntime.*\.mjs$/i,
  /onnxruntime.*\.wasm$/i,
  /\/resolve\/.*\//,          // Hugging Face model files
  /myqcloud\.com/,            // Tencent COS CDN model files
  /cdn-lfs.*huggingface/,     // Hugging Face LFS
]

function isModelRequest(url) {
  return MODEL_PATTERNS.some(pattern => pattern.test(url))
}

// Install — pre-cache nothing, just activate immediately
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Clean old cache versions
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('bg-zero-models-') && k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch — cache-first for model files
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only intercept GET requests that look like model files
  if (request.method !== 'GET' || !isModelRequest(request.url)) {
    return // Let the browser handle it normally
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try cache first
      const cached = await cache.match(request)
      if (cached) {
        return cached
      }

      // Not in cache — fetch from network
      const response = await fetch(request)

      // Only cache successful responses
      if (response.ok) {
        // Clone the response before caching (response body can only be consumed once)
        cache.put(request, response.clone())
      }

      return response
    })
  )
})
