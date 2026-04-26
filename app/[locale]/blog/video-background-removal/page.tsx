'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { VIDEO_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function VideoBackgroundRemovalPage() {
  const t = useTranslations('blogVideo')
  const tb = useTranslations('blog')

  const tools = [
    { name: t('tool1Name'), type: t('tool1Type'), price: t('tool1Price'), realtime: t('tool1Realtime') },
    { name: t('tool2Name'), type: t('tool2Type'), price: t('tool2Price'), realtime: t('tool2Realtime') },
    { name: t('tool3Name'), type: t('tool3Type'), price: t('tool3Price'), realtime: t('tool3Realtime') },
    { name: t('tool4Name'), type: t('tool4Type'), price: t('tool4Price'), realtime: t('tool4Realtime') },
    { name: t('tool5Name'), type: t('tool5Type'), price: t('tool5Price'), realtime: t('tool5Realtime') },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={14} />
          {tb('backToBlog')}
        </Link>

        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* What */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whatTitle')}</h2>
          <p className={styles.paragraph}>{t('whatDesc')}</p>
        </section>

        {/* Methods */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('methodsTitle')}</h2>

          <h3 className={styles.h3}>{t('method1Title')}</h3>
          <p className={styles.paragraph}>{t('method1Desc')}</p>

          <h3 className={styles.h3}>{t('method2Title')}</h3>
          <p className={styles.paragraph}>{t('method2Desc')}</p>

          <h3 className={styles.h3}>{t('method3Title')}</h3>
          <p className={styles.paragraph}>{t('method3Desc')}</p>
        </section>

        {/* Tools Comparison Table */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('toolsTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('toolCol1')}</th>
                  <th>{t('toolCol2')}</th>
                  <th>{t('toolCol3')}</th>
                  <th>{t('toolCol4')}</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.name}>
                    <td className={styles.tdLabel}>{tool.name}</td>
                    <td>{tool.type}</td>
                    <td>{tool.price}</td>
                    <td>{tool.realtime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* BG-Zero Frame Processing */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('bgzeroTitle')}</h2>
          <ol className={styles.orderedList}>
            <li>{t('bgzeroStep1')}</li>
            <li>{t('bgzeroStep2')}</li>
            <li>{t('bgzeroStep3')}</li>
            <li>{t('bgzeroStep4')}</li>
          </ol>
          <p className={styles.note}>{t('bgzeroNote')}</p>
        </section>

        {/* Future */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('futureTitle')}</h2>
          <p className={styles.paragraph}>{t('futureDesc')}</p>
        </section>

        {/* FAQ */}
        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={VIDEO_FAQ_KEYS} />
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
