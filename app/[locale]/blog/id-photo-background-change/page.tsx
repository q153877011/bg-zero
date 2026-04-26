'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles } from 'lucide-react'
import styles from './page.module.css'

export default function IdPhotoBackgroundChangePage() {
  const t = useTranslations('blogIdPhoto')
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

        {/* Why */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whyTitle')}</h2>
          <p className={styles.paragraph}>{t('whyDesc')}</p>
        </section>

        {/* Specs */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('specsTitle')}</h2>
          <ul className={styles.bulletList}>
            <li>{t('spec1')}</li>
            <li>{t('spec2')}</li>
            <li>{t('spec3')}</li>
            <li>{t('spec4')}</li>
            <li>{t('spec5')}</li>
            <li>{t('spec6')}</li>
          </ul>
        </section>

        {/* Steps */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('stepsTitle')}</h2>
          <div>
            <h3 className={styles.h3}>{t('step1Title')}</h3>
            <p className={styles.paragraph}>{t('step1Desc')}</p>
            <h3 className={styles.h3}>{t('step2Title')}</h3>
            <p className={styles.paragraph}>{t('step2Desc')}</p>
            <h3 className={styles.h3}>{t('step3Title')}</h3>
            <p className={styles.paragraph}>{t('step3Desc')}</p>
          </div>
        </section>

        {/* Tips */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('tipsTitle')}</h2>
          <ul className={styles.bulletList}>
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
            <li>{t('tip4')}</li>
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
