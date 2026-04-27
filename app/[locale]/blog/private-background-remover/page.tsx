'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { PRIVACY_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function PrivateBackgroundRemoverPage() {
  const t = useTranslations('blogPrivacy')
  const tb = useTranslations('blog')

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={14} />
          {tb('backToBlog')}
        </Link>

        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('heading')}</h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
        </header>

        {/* Privacy problem */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('problemTitle')}</h2>
          <p className={styles.paragraph}>{t('problemDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('problem1')}</li>
            <li>{t('problem2')}</li>
            <li>{t('problem3')}</li>
            <li>{t('problem4')}</li>
            <li>{t('problem5')}</li>
          </ul>
        </section>

        {/* Solution */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('solutionTitle')}</h2>
          <p className={styles.highlight}>{t('solutionDesc')}</p>
        </section>

        {/* How it works */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('howTitle')}</h2>
          <p className={styles.paragraph}>{t('howDesc')}</p>

          <div className={styles.stepCards}>
            {(['how1', 'how2', 'how3', 'how4'] as const).map((key, i) => (
              <div key={key} className={styles.stepCard}>
                <div className={styles.stepCardNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className={styles.h3}>{t(`${key}Title`)}</h3>
                <p className={styles.stepCardDesc}>{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('compareTitle')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('compareCol1')}</th>
                  <th className={styles.thGood}>{t('compareCol2')}</th>
                  <th>{t('compareCol3')}</th>
                </tr>
              </thead>
              <tbody>
                {(['compare1', 'compare2', 'compare3', 'compare4', 'compare5', 'compare6'] as const).map((key) => (
                  <tr key={key}>
                    <td className={styles.tdLabel}>{t(`${key}Dim`)}</td>
                    <td className={styles.tdGood}>{t(`${key}Local`)}</td>
                    <td className={styles.tdNeutral}>{t(`${key}Cloud`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scenarios */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t('scenariosTitle')}</h2>
          <p className={styles.paragraph}>{t('scenariosDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('scenario1')}</li>
            <li>{t('scenario2')}</li>
            <li>{t('scenario3')}</li>
            <li>{t('scenario4')}</li>
            <li>{t('scenario5')}</li>
            <li>{t('scenario6')}</li>
          </ul>
        </section>

        {/* Technical guarantees */}
        <section className={styles.section}>
          <h2 className={styles.h2}>
            <ShieldCheck size={18} className={styles.h2Icon} />
            {t('techTitle')}
          </h2>
          <ul className={styles.techList}>
            <li>{t('tech1')}</li>
            <li>{t('tech2')}</li>
            <li>{t('tech3')}</li>
            <li>{t('tech4')}</li>
            <li>{t('tech5')}</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={PRIVACY_FAQ_KEYS} />
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
