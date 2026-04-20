'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, User, ShieldCheck, Lightbulb } from 'lucide-react'
import styles from './page.module.css'

export default function UseCaseProfilePage() {
  const t = useTranslations('useCases.profile')

  const steps = [t('step1'), t('step2'), t('step3')]
  const tips = [t('tip1'), t('tip2'), t('tip3'), t('tip4')]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroIcon}>
            <User size={24} />
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

        {/* Tips */}
        <section className={styles.section}>
          <h2 className={styles.h2}>
            <Lightbulb size={18} className={styles.tipIcon} />
            {t('tipsTitle')}
          </h2>
          <ul className={styles.tipList}>
            {tips.map((tip) => (
              <li key={tip} className={styles.tipItem}>{tip}</li>
            ))}
          </ul>
        </section>

        {/* Privacy */}
        <section className={styles.privacyBox}>
          <ShieldCheck size={20} className={styles.privacyIcon} />
          <div>
            <h3 className={styles.h3}>{t('privacyTitle')}</h3>
            <p className={styles.paragraph}>{t('privacyDesc')}</p>
          </div>
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
