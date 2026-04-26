'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, Check, ShieldCheck } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { COMPARE_FAQ_KEYS } from '@/lib/constants/faq'
import TrademarkDisclaimer from '@/components/seo/TrademarkDisclaimer'
import styles from './page.module.css'

export default function CompareBestPage() {
  const t = useTranslations('compareBest')

  const overviewRows = [
    {
      tool: t('bgzeroRow'),
      price: t('bgzeroPrice'),
      privacy: t('bgzeroPrivacy'),
      watermark: t('bgzeroWatermark'),
      batch: t('bgzeroBatch'),
      offline: t('bgzeroOffline'),
      open: t('bgzeroOpen'),
      highlight: true,
    },
    {
      tool: t('removebgRow'),
      price: t('removebgPrice'),
      privacy: t('removebgPrivacy'),
      watermark: t('removebgWatermark'),
      batch: t('removebgBatch'),
      offline: t('removebgOffline'),
      open: t('removebgOpen'),
      highlight: false,
    },
    {
      tool: t('iloveimgRow'),
      price: t('iloveimgPrice'),
      privacy: t('iloveimgPrivacy'),
      watermark: t('iloveimgWatermark'),
      batch: t('iloveimgBatch'),
      offline: t('iloveimgOffline'),
      open: t('iloveimgOpen'),
      highlight: false,
    },
    {
      tool: t('fotorRow'),
      price: t('fotorPrice'),
      privacy: t('fotorPrivacy'),
      watermark: t('fotorWatermark'),
      batch: t('fotorBatch'),
      offline: t('fotorOffline'),
      open: t('fotorOpen'),
      highlight: false,
    },
    {
      tool: t('baiduRow'),
      price: t('baiduPrice'),
      privacy: t('baiduPrivacy'),
      watermark: t('baiduWatermark'),
      batch: t('baiduBatch'),
      offline: t('baiduOffline'),
      open: t('baiduOpen'),
      highlight: false,
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* Criteria */}
        <section className={styles.criteriaSection}>
          <h2 className={styles.h2}>{t('criteriaTitle')}</h2>
          <p className={styles.criteriaDesc}>{t('criteriaDesc')}</p>
        </section>

        {/* Overview Table */}
        <section className={styles.tableSection}>
          <h2 className={styles.h2}>{t('overviewTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('colTool')}</th>
                  <th>{t('colPrice')}</th>
                  <th>{t('colPrivacy')}</th>
                  <th>{t('colWatermark')}</th>
                  <th>{t('colBatch')}</th>
                  <th>{t('colOffline')}</th>
                  <th>{t('colOpenSource')}</th>
                </tr>
              </thead>
              <tbody>
                {overviewRows.map((row) => (
                  <tr key={row.tool} className={row.highlight ? styles.trHighlight : undefined}>
                    <td className={styles.tdLabel}>{row.tool}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.price}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.privacy}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.watermark}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.batch}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.offline}</td>
                    <td className={row.highlight ? styles.tdGood : styles.tdNeutral}>{row.open}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* BG-Zero Detail */}
        <section className={styles.toolSection}>
          <h2 className={styles.h2}>{t('bgzeroTitle')}</h2>
          <p className={styles.toolDesc}>{t('bgzeroDesc')}</p>
          <ul className={styles.proConList}>
            <li className={styles.proItem}><Check size={14} />{t('bgzeroPro1')}</li>
            <li className={styles.proItem}><Check size={14} />{t('bgzeroPro2')}</li>
            <li className={styles.proItem}><Check size={14} />{t('bgzeroPro3')}</li>
            <li className={styles.conItem}>{t('bgzeroCon1')}</li>
            <li className={styles.conItem}>{t('bgzeroCon2')}</li>
          </ul>
        </section>

        {/* remove.bg Detail */}
        <section className={styles.toolSection}>
          <h2 className={styles.h2}>{t('removebgTitle')}</h2>
          <p className={styles.toolDesc}>{t('removebgDesc')}</p>
          <ul className={styles.proConList}>
            <li className={styles.proItem}><Check size={14} />{t('removebgPro1')}</li>
            <li className={styles.proItem}><Check size={14} />{t('removebgPro2')}</li>
            <li className={styles.conItem}>{t('removebgCon1')}</li>
            <li className={styles.conItem}>{t('removebgCon2')}</li>
          </ul>
        </section>

        {/* iLoveIMG Detail */}
        <section className={styles.toolSection}>
          <h2 className={styles.h2}>{t('iloveimgTitle')}</h2>
          <p className={styles.toolDesc}>{t('iloveimgDesc')}</p>
          <ul className={styles.proConList}>
            <li className={styles.proItem}><Check size={14} />{t('iloveimgPro1')}</li>
            <li className={styles.proItem}><Check size={14} />{t('iloveimgPro2')}</li>
            <li className={styles.conItem}>{t('iloveimgCon1')}</li>
            <li className={styles.conItem}>{t('iloveimgCon2')}</li>
          </ul>
        </section>

        {/* How to Choose */}
        <section className={styles.chooseSection}>
          <h2 className={styles.h2}>{t('chooseTitle')}</h2>
          <ul className={styles.chooseList}>
            <li><ShieldCheck size={14} className={styles.chooseIcon} />{t('choosePrivacy')}</li>
            <li><ShieldCheck size={14} className={styles.chooseIcon} />{t('chooseQuality')}</li>
            <li><ShieldCheck size={14} className={styles.chooseIcon} />{t('chooseFree')}</li>
            <li><ShieldCheck size={14} className={styles.chooseIcon} />{t('chooseApi')}</li>
            <li><ShieldCheck size={14} className={styles.chooseIcon} />{t('chooseSuite')}</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={COMPARE_FAQ_KEYS} />
        </section>

        {/* Trademark Disclaimer */}
        <TrademarkDisclaimer
          trademarks={[
            { name: 'remove.bg', owner: 'Kaleido AI GmbH' },
            { name: 'iLoveIMG', owner: 'iLovePDF S.L.' },
          ]}
        />

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
