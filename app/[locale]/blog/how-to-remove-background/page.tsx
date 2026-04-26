'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles } from 'lucide-react'
import styles from './page.module.css'

export default function HowToRemoveBgPage() {
  const t = useTranslations('blogHowToRemoveBg')
  const tb = useTranslations('blog')

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/blog" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tb('backToBlog')}
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* What is background removal */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whatTitle')}</h2>
          <p className={styles.paragraph}>{t('whatDesc')}</p>
        </section>

        {/* Method 1: AI Auto */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('autoTitle')}</h2>
          <p className={styles.paragraph}>{t('autoDesc')}</p>
          <ol className={styles.orderedList}>
            <li>{t('autoStep1')}</li>
            <li>{t('autoStep2')}</li>
            <li>{t('autoStep3')}</li>
            <li>{t('autoStep4')}</li>
            <li>{t('autoStep5')}</li>
          </ol>
        </section>

        {/* Method 2: Manual */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('manualTitle')}</h2>
          <p className={styles.paragraph}>{t('manualDesc')}</p>
          <ol className={styles.orderedList}>
            <li>{t('manualStep1')}</li>
            <li>{t('manualStep2')}</li>
            <li>{t('manualStep3')}</li>
            <li>{t('manualStep4')}</li>
            <li>{t('manualStep5')}</li>
          </ol>
        </section>

        {/* AI Engines */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('enginesTitle')}</h2>
          <p className={styles.paragraph}>{t('enginesDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('engineImgly')}</li>
            <li>{t('engineTransformers')}</li>
            <li>{t('engineRembg')}</li>
          </ul>
        </section>

        {/* Scenarios */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('scenariosTitle')}</h2>
          <ul className={styles.bulletList}>
            <li>{t('scenario1')}</li>
            <li>{t('scenario2')}</li>
            <li>{t('scenario3')}</li>
            <li>{t('scenario4')}</li>
            <li>{t('scenario5')}</li>
          </ul>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaSub}>{t('ctaSub')}</p>
          <Link href="/auto" className={styles.ctaBtn}>
            <Sparkles size={16} />
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </div>
  )
}
