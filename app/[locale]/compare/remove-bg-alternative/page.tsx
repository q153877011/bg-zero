'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ShieldCheck, Sparkles, Wifi, Code } from 'lucide-react'
import TrademarkDisclaimer from '@/components/seo/TrademarkDisclaimer'
import styles from './page.module.css'

export default function CompareRemoveBgPage() {
  const t = useTranslations('compare')

  const rows = [
    { label: t('rowPrivacy'), bgZero: t('rowPrivacyBgZero'), other: t('rowPrivacyOther') },
    { label: t('rowPrice'), bgZero: t('rowPriceBgZero'), other: t('rowPriceOther') },
    { label: t('rowWatermark'), bgZero: t('rowWatermarkBgZero'), other: t('rowWatermarkOther') },
    { label: t('rowQuality'), bgZero: t('rowQualityBgZero'), other: t('rowQualityOther') },
    { label: t('rowOffline'), bgZero: t('rowOfflineBgZero'), other: t('rowOfflineOther') },
    { label: t('rowOpenSource'), bgZero: t('rowOpenSourceBgZero'), other: t('rowOpenSourceOther') },
  ]

  const reasons = [
    { icon: ShieldCheck, title: t('reason1Title'), desc: t('reason1Desc') },
    { icon: Sparkles, title: t('reason2Title'), desc: t('reason2Desc') },
    { icon: Code, title: t('reason3Title'), desc: t('reason3Desc') },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* Comparison Table */}
        <section className={styles.tableSection}>
          <h2 className={styles.h2}>{t('tableTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('featureCol')}</th>
                  <th className={styles.thHighlight}>{t('bgZeroCol')}</th>
                  <th>{t('removeBgCol')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className={styles.tdLabel}>{row.label}</td>
                    <td className={styles.tdGood}>{row.bgZero}</td>
                    <td className={styles.tdNeutral}>{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Switch */}
        <section className={styles.reasonsSection}>
          <h2 className={styles.h2}>{t('whySwitch')}</h2>
          <div className={styles.reasonsGrid}>
            {reasons.map((r) => (
              <div key={r.title} className={styles.reasonCard}>
                <div className={styles.reasonIcon}>
                  <r.icon size={20} />
                </div>
                <h3 className={styles.reasonTitle}>{r.title}</h3>
                <p className={styles.reasonDesc}>{r.desc}</p>
              </div>
            ))}
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

        {/* Trademark Disclaimer */}
        <TrademarkDisclaimer
          trademarks={[
            { name: 'remove.bg', owner: 'Kaleido AI GmbH' },
          ]}
        />
      </div>
    </div>
  )
}
