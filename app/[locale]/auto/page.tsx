'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, ShieldCheck, Cpu, Zap, Lightbulb, Check } from 'lucide-react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import AutoProcessor from '@/components/auto/AutoProcessor'
import styles from './page.module.css'

// definePageMeta({ auth: true }) — handled by proxy

export default function AutoPage() {
  const { track } = useAnalytics()
  const t = useTranslations('auto')

  useEffect(() => {
    track('page_view', { page: '/auto' })
  }, [track])

  const tips = useMemo(() => [
    t('tip1'),
    t('tip2'),
    t('tip3'),
    t('tip4'),
    t('tip5'),
    t('tip6'),
  ], [t])

  return (
    <div className={styles.pgAuto}>

      {/* ── Decorative background ── */}
      <div className={styles.pgBg} aria-hidden="true">
        <div className={styles.pgBgNoise} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb1}`} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb2}`} />
        <div className={`${styles.pgBgOrb} ${styles.pgBgOrb3}`} />
      </div>

      {/* ── Page Header ── */}
      <div className={styles.pgHeader}>
        <div className={`${styles.pghLeft} animate-fade-up`}>
          <div className={styles.pghIcon}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className={styles.pghTitle}>{t('pageTitle')}</h1>
            <p className={styles.pghSub}>{t('pageSub')}</p>
          </div>
        </div>
        <div className={`${styles.pghPills} animate-fade-up delay-100`}>
          <span className={styles.pghPill}><ShieldCheck size={11} />{t('pillLocal')}</span>
          <span className={styles.pghPill}><Cpu size={11} />{t('pillBrowser')}</span>
          <span className={styles.pghPill}><Zap size={11} />{t('pillFree')}</span>
        </div>
      </div>

      {/* ── Main Processor ── */}
      <div className={`${styles.pgMain} animate-fade-up delay-150`}>
        <AutoProcessor />
      </div>

      {/* ── Tips ── */}
      <div className={`${styles.pgTips} animate-fade-up delay-200`}>
        <div className={styles.tipsCard}>
          <div className={styles.tcHeader}>
            <div className={styles.tcIcon}><Lightbulb size={13} /></div>
            <span className={styles.tcLabel}>{t('tipsLabel')}</span>
          </div>
          <div className={styles.tcGrid}>
            {tips.map((tip) => (
              <div key={tip} className={styles.tcItem}>
                <span className={styles.tcCheck}><Check size={10} /></span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
