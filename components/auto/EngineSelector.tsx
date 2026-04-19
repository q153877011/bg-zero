'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, Cpu } from 'lucide-react'
import type { EngineType, RembgModel } from '@/lib/hooks/useAutoRemoval'
import { REMBG_MODELS } from '@/lib/hooks/useAutoRemoval'
import styles from './EngineSelector.module.css'

interface EngineSelectorProps {
  currentEngine: EngineType
  selectedRembgModel: RembgModel
  isLoadingEngine: boolean
  loadingText?: string
  loadProgress?: number
  webGPUAvailable?: boolean
  sharedArrayBufferAvailable?: boolean
  onSelectEngine: (engine: EngineType) => void
  onSelectRembgModel: (model: string) => void
}

export default function EngineSelector({
  currentEngine,
  selectedRembgModel,
  isLoadingEngine,
  loadingText,
  loadProgress = 0,
  webGPUAvailable,
  sharedArrayBufferAvailable,
  onSelectEngine,
  onSelectRembgModel,
}: EngineSelectorProps) {
  const t = useTranslations('auto')

  const rembgDescMap: Record<string, string> = useMemo(() => ({
    u2netp: t('rembgU2netp'),
    silueta: t('rembgSilueta'),
    u2net_human_seg: t('rembgHumanSeg'),
    'isnet-general-use': t('rembgIsnetGeneral'),
    'isnet-anime': t('rembgIsnetAnime'),
    u2net: t('rembgU2net'),
  }), [t])

  const engines = useMemo(() => [
    {
      id: 'imgly' as EngineType,
      label: 'imgly',
      default: true,
      tags: [t('engineImglyTag1'), t('engineImglyTag2'), t('engineImglyTag3')],
    },
    {
      id: 'transformers' as EngineType,
      label: 'Transformers.js',
      default: false,
      tags: [t('engineTransformersTag1'), t('engineTransformersTag2'), t('engineTransformersTag3')],
    },
    {
      id: 'rembg-web' as EngineType,
      label: 'rembg-web',
      default: false,
      tags: [t('engineRembgTag1'), t('engineRembgTag2'), t('engineRembgTag3')],
    },
  ], [t])

  return (
    <div>
      {/* Browser compatibility warning */}
      {!sharedArrayBufferAvailable && (
        <div className="mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-100 text-[12px] text-amber-700">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <span>{t('sabWarning')}</span>
        </div>
      )}

      {/* Engine Selector */}
      <div className="bg-[var(--bg-canvas)] border border-[rgba(28,25,23,0.07)] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={14} className="text-[var(--text-secondary)]" />
          <span className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {t('engineLabel')}
          </span>
        </div>

        {/* Engine options */}
        <div className={styles.engineGrid} role="radiogroup" aria-label={t('engineSelect')}>
          {engines.map((eng) => {
            const isSelected = currentEngine === eng.id
            const isDisabledGPU = eng.id === 'transformers' && !webGPUAvailable
            const isDisabled = isLoadingEngine || isDisabledGPU

            return (
              <button
                key={eng.id}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isDisabled || undefined}
                className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-150 text-left min-w-0 ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)] shadow-[0_0_0_1px_var(--accent-primary)]'
                    : isDisabledGPU
                      ? 'border-[rgba(28,25,23,0.06)] bg-[var(--bg-secondary)] opacity-60 cursor-not-allowed'
                      : 'border-[rgba(28,25,23,0.09)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-muted)]'
                }`}
                disabled={isDisabled}
                onClick={() => {
                  if (eng.id !== 'transformers' || webGPUAvailable) {
                    onSelectEngine(eng.id)
                  }
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'border-[var(--accent-primary)]' : 'border-[rgba(28,25,23,0.2)]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{eng.label}</span>
                    {eng.default && (
                      <span className="tag tag-indigo" style={{ fontSize: 10, padding: '1px 5px' }}>{t('engineDefault')}</span>
                    )}
                    {eng.id === 'transformers' && (
                      <span
                        className="tag"
                        style={{ fontSize: 9, padding: '1px 5px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                        title={t('ccByNcTitle')}
                      >
                        CC BY-NC
                      </span>
                    )}
                    {eng.id === 'transformers' && !webGPUAvailable && (
                      <span
                        className="tag tag-gray"
                        style={{ fontSize: 9, padding: '1px 5px' }}
                        title={t('requiresWebGPUTitle')}
                      >
                        {t('requiresWebGPU')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {eng.tags.map((tag) => (
                      <span key={tag} className="tag tag-gray" style={{ fontSize: 10, padding: '1px 5px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* rembg model selector */}
        {currentEngine === 'rembg-web' && (
          <div className="mt-3 pt-3 border-t border-[rgba(28,25,23,0.06)]">
            <p className="text-[12px] text-[var(--text-secondary)] mb-2 font-medium">{t('engineSelectModel')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {REMBG_MODELS.map((model) => (
                <button
                  key={model.id}
                  className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                    selectedRembgModel === model.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)]'
                      : 'border-[rgba(28,25,23,0.09)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)]'
                  }`}
                  onClick={() => onSelectRembgModel(model.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">{model.label}</span>
                    {'recommended' in model && model.recommended && (
                      <span className="tag tag-green" style={{ fontSize: 9, padding: '0 4px' }}>{t('engineRecommended')}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-tertiary)]">{model.size} · {rembgDescMap[model.id] || model.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoadingEngine && (
          <div className="mt-3 pt-3 border-t border-[rgba(28,25,23,0.06)]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px] text-[var(--text-secondary)]">{loadingText || t('statusLoading')}</span>
            </div>
            {loadProgress > 0 && (
              <div className="mt-2">
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${loadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
