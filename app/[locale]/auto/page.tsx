'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, ShieldCheck, Cpu, Zap, Lightbulb, Check, Upload, Settings, Download } from 'lucide-react'
import AutoProcessor from '@/components/auto/AutoProcessor'
import FAQSection from '@/components/seo/FAQSection'
import { AUTO_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

// definePageMeta({ auth: true }) — handled by proxy

export default function AutoPage() {
  const t = useTranslations('auto')

  const tips = useMemo(() => [
    t('tip1'),
    t('tip2'),
    t('tip3'),
    t('tip4'),
    t('tip5'),
    t('tip6'),
  ], [t])

  const seoSteps = useMemo(() => [
    { icon: Upload, title: t('seoStep1Title'), desc: t('seoStep1Desc') },
    { icon: Settings, title: t('seoStep2Title'), desc: t('seoStep2Desc') },
    { icon: Download, title: t('seoStep3Title'), desc: t('seoStep3Desc') },
  ], [t])

  const seoWhyItems = useMemo(() => [
    t('seoWhyPrivacy'),
    t('seoWhyFree'),
    t('seoWhyEngines'),
    t('seoWhyOffline'),
    t('seoWhyBatch'),
    t('seoWhyOpen'),
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

      {/* ══ SEO: How To ══════════════════════════════════════ */}
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

      {/* ══ SEO: Why Choose ════════════════════════════════════ */}
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

      {/* ══ SEO: FAQ ═══════════════════════════════════════════ */}
      <section className={styles.seoSection}>
        <div className={styles.seoHead}>
          <h2 className={styles.seoTitle}>{t('seoFaqTitle')}</h2>
          <p className={styles.seoSub}>{t('seoFaqSub')}</p>
        </div>
        <FAQSection keys={AUTO_FAQ_KEYS} />
      </section>

    </div>
  )
}
