'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ShoppingBag, Check } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { ECOMMERCE_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function UseCaseEcommercePage() {
  const t = useTranslations('useCases.ecommerce')

  const steps = [t('step1'), t('step2'), t('step3')]
  const benefits = [t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'), t('benefit5')]

  const specs = [
    { platform: t('spec1Platform'), size: t('spec1Size'), bg: t('spec1Bg') },
    { platform: t('spec2Platform'), size: t('spec2Size'), bg: t('spec2Bg') },
    { platform: t('spec3Platform'), size: t('spec3Size'), bg: t('spec3Bg') },
    { platform: t('spec4Platform'), size: t('spec4Size'), bg: t('spec4Bg') },
  ]

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
                {specs.map((row) => (
                  <tr key={row.platform}>
                    <td className={styles.tdLabel}>{row.platform}</td>
                    <td>{row.size}</td>
                    <td>{row.bg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comparison Table */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('comparisonTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('compColMethod')}</th>
                  <th>{t('compColTime')}</th>
                  <th>{t('compColCost')}</th>
                  <th>{t('compColQuality')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.tdLabel}>{t('compRowBgZero')}</td>
                  <td className={styles.tdGood}>{t('compRowBgZeroTime')}</td>
                  <td className={styles.tdGood}>{t('compRowBgZeroCost')}</td>
                  <td className={styles.tdGood}>{t('compRowBgZeroQuality')}</td>
                </tr>
                <tr>
                  <td className={styles.tdLabel}>{t('compRowManual')}</td>
                  <td>{t('compRowManualTime')}</td>
                  <td>{t('compRowManualCost')}</td>
                  <td>{t('compRowManualQuality')}</td>
                </tr>
                <tr>
                  <td className={styles.tdLabel}>{t('compRowCloud')}</td>
                  <td>{t('compRowCloudTime')}</td>
                  <td>{t('compRowCloudCost')}</td>
                  <td>{t('compRowCloudQuality')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={ECOMMERCE_FAQ_KEYS} />
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
