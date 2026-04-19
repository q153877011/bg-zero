/**
 * lib/hooks/useEnginePreference.ts
 * localStorage 持久化引擎偏好
 */

export type EngineType = 'imgly' | 'transformers' | 'rembg-web'

export interface EnginePreference {
  engine: EngineType
  rembgModel?: string
}

const STORAGE_KEY = 'bg-zero-engine-preference'
const VALID_ENGINES: EngineType[] = ['imgly', 'transformers', 'rembg-web']

export function useEnginePreference() {
  function load(): EnginePreference {
    if (typeof window === 'undefined') return { engine: 'imgly' }
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return { engine: 'imgly' }
      const parsed = JSON.parse(saved)
      if (!parsed || !VALID_ENGINES.includes(parsed.engine)) {
        return { engine: 'imgly' }
      }
      return { engine: parsed.engine, rembgModel: typeof parsed.rembgModel === 'string' ? parsed.rembgModel : undefined }
    } catch {
      return { engine: 'imgly' }
    }
  }

  function save(pref: EnginePreference) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pref))
    } catch {}
  }

  function clear() {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return { load, save, clear }
}
