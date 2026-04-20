'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ShoppingBag, Check } from 'lucide-react'
import styles from './page.module.css'

export default function UseCaseEcommercePage() {
  const t = useTranslations('useCases.ecommerce')

  const steps = [t('step1'), t('step2'), t('step3')]
  const benefits = [t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'), t('benefit5')]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroIcon}>
            <ShoppingBag size={24} />
          </div>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* Why */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whyTitle')}</h2>
          <p className={styles.paragraph}>{t('whyDesc')}</p>
        </section>

        {/* How */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('howTitle')}</h2>
          <ol className={styles.stepList}>
            {steps.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Benefits */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('benefitsTitle')}</h2>
          <ul className={styles.benefitList}>
            {benefits.map((b) => (
              <li key={b} className={styles.benefitItem}>
                <Check size={16} className={styles.checkIcon} />
                <span>{b}</span>
              </li>
            ))}
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
