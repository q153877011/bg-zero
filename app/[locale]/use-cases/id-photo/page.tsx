'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, CreditCard, Check } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { ID_PHOTO_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function UseCaseIdPhotoPage() {
  const t = useTranslations('useCases.idPhoto')

  const steps = [t('step1'), t('step2'), t('step3')]
  const benefits = [t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'), t('benefit5')]

  const specs = [
    { name: t('spec1Name'), size: t('spec1Size'), bg: t('spec1Bg') },
    { name: t('spec2Name'), size: t('spec2Size'), bg: t('spec2Bg') },
    { name: t('spec3Name'), size: t('spec3Size'), bg: t('spec3Bg') },
    { name: t('spec4Name'), size: t('spec4Size'), bg: t('spec4Bg') },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroIcon}>
            <CreditCard size={24} />
          </div>
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
                {specs.map((spec, i) => (
                  <tr key={i}>
                    <td>{spec.name}</td>
                    <td>{spec.size}</td>
                    <td>{spec.bg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

        {/* FAQ */}
        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={ID_PHOTO_FAQ_KEYS} />
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
