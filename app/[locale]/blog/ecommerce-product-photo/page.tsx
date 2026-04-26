'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles } from 'lucide-react'
import styles from './page.module.css'

export default function EcommerceProductPhotoPage() {
  const t = useTranslations('blogEcommerce')
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

        {/* Platform Specs Table */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('specsTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('specCol1')}</th>
                  <th>{t('specCol2')}</th>
                  <th>{t('specCol3')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('spec1Platform')}</td>
                  <td>{t('spec1Size')}</td>
                  <td>{t('spec1Bg')}</td>
                </tr>
                <tr>
                  <td>{t('spec2Platform')}</td>
                  <td>{t('spec2Size')}</td>
                  <td>{t('spec2Bg')}</td>
                </tr>
                <tr>
                  <td>{t('spec3Platform')}</td>
                  <td>{t('spec3Size')}</td>
                  <td>{t('spec3Bg')}</td>
                </tr>
                <tr>
                  <td>{t('spec4Platform')}</td>
                  <td>{t('spec4Size')}</td>
                  <td>{t('spec4Bg')}</td>
                </tr>
              </tbody>
            </table>
          </div>
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

        {/* Advanced Tips */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('advancedTitle')}</h2>
          <ul className={styles.bulletList}>
            <li>{t('advanced1')}</li>
            <li>{t('advanced2')}</li>
            <li>{t('advanced3')}</li>
            <li>{t('advanced4')}</li>
          </ul>
        </section>

        {/* Best Practices */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('bestTitle')}</h2>
          <ul className={styles.bulletList}>
            <li>{t('best1')}</li>
            <li>{t('best2')}</li>
            <li>{t('best3')}</li>
            <li>{t('best4')}</li>
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
