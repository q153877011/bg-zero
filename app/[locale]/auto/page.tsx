'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, ShieldCheck, Cpu, Zap, Check, Upload, Settings, Download } from 'lucide-react'
import AutoProcessor from '@/components/auto/AutoProcessor'
import FAQSection from '@/components/seo/FAQSection'
import { AUTO_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function AutoPage() {
  const t = useTranslations('auto')

  const tips = useMemo(() => [
    t('tip1'), t('tip2'), t('tip3'),
    t('tip4'), t('tip5'), t('tip6'),
  ], [t])

  const seoSteps = useMemo(() => [
    { icon: Upload, title: t('seoStep1Title'), desc: t('seoStep1Desc') },
    { icon: Settings, title: t('seoStep2Title'), desc: t('seoStep2Desc') },
    { icon: Download, title: t('seoStep3Title'), desc: t('seoStep3Desc') },
  ], [t])

  const seoWhyItems = useMemo(() => [
    t('seoWhyPrivacy'), t('seoWhyFree'), t('seoWhyEngines'),
    t('seoWhyOffline'), t('seoWhyBatch'), t('seoWhyOpen'),
  ], [t])

  return (
    <div className={styles.page}>

      {/* ━━ TOOL ZONE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className={styles.toolZone}>
        <div className={styles.toolInner}>

          {/* Compact toolbar header */}
          <div className={`${styles.toolbar} animate-fade-up`}>
            <div className={styles.tbLeft}>
              <div className={styles.tbIcon}><Sparkles size={14} /></div>
              <div>
                <h1 className={styles.tbTitle}>{t('pageTitle')}</h1>
                <p className={styles.tbSub}>{t('pageSub')}</p>
              </div>
            </div>
            <div className={styles.tbPills}>
              <span className={styles.tbPill}><ShieldCheck size={10} />{t('pillLocal')}</span>
              <span className={styles.tbPill}><Cpu size={10} />{t('pillBrowser')}</span>
              <span className={styles.tbPill}><Zap size={10} />{t('pillFree')}</span>
            </div>
          </div>

          {/* ── THE WORKSPACE: processor fills the space ── */}
          <div className={`${styles.workspace} animate-fade-up delay-100`}>
            <AutoProcessor />
          </div>

          {/* Inline tips — collapsed, not a card */}
          <div className={`${styles.tipsRow} animate-fade-up delay-150`}>
            {tips.map((tip) => (
              <span key={tip} className={styles.tip}>{tip}</span>
            ))}
          </div>

        </div>
      </div>

      {/* ━━ SEO ZONE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className={styles.seoZone}>
        <div className={styles.seoInner}>

          {/* How To */}
          <section className={styles.seoSection}>
            <div className={styles.seoHead}>
              <h2 className={styles.seoTitle}>{t('seoHowTitle')}</h2>
              <p className={styles.seoSub}>{t('seoHowSub')}</p>
            </div>
            <div className={styles.seoSteps}>
              {seoSteps.map((step, i) => (
                <div key={i} className={styles.seoStep}>
                  <div className={styles.seoStepNum}>{String(i + 1).padStart(2, '0')}</div>
                  <div className={styles.seoStepIcon}><step.icon size={18} /></div>
                  <h3 className={styles.seoStepTitle}>{step.title}</h3>
                  <p className={styles.seoStepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose */}
          <section className={styles.seoSection}>
            <div className={styles.seoHead}>
              <h2 className={styles.seoTitle}>{t('seoWhyTitle')}</h2>
            </div>
            <div className={styles.seoWhyGrid}>
              {seoWhyItems.map((item) => (
                <div key={item} className={styles.seoWhyItem}>
                  <span className={styles.seoWhyCheck}><Check size={12} /></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className={styles.seoSection}>
            <div className={styles.seoHead}>
              <h2 className={styles.seoTitle}>{t('seoFaqTitle')}</h2>
              <p className={styles.seoSub}>{t('seoFaqSub')}</p>
            </div>
            <FAQSection keys={AUTO_FAQ_KEYS} />
          </section>

        </div>
      </div>

    </div>
  )
}
