'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'
import FAQSection from '@/components/seo/FAQSection'
import { WEBP_FAQ_KEYS } from '@/lib/constants/faq'
import styles from './page.module.css'

export default function WebpRemoveBgPage() {
  const t = useTranslations('blogWebp')
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

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('whatTitle')}</h2>
          <p className={styles.paragraph}>{t('whatDesc')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('problemTitle')}</h2>
          <p className={styles.paragraph}>{t('problemDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('problem1')}</li>
            <li>{t('problem2')}</li>
            <li>{t('problem3')}</li>
            <li>{t('problem4')}</li>
          </ul>
          <p className={styles.highlight}>{t('problemSolution')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('tutorialTitle')}</h2>

          <h3 className={styles.h3}>{t('step1Title')}</h3>
          <p className={styles.paragraph}>{t('step1Desc')}</p>

          <h3 className={styles.h3}>{t('step2Title')}</h3>
          <p className={styles.paragraph}>{t('step2Desc')}</p>

          <h3 className={styles.h3}>{t('step3Title')}</h3>
          <p className={styles.paragraph}>{t('step3Desc')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('enginesTitle')}</h2>
          <p className={styles.paragraph}>{t('enginesDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('engine1')}</li>
            <li>{t('engine2')}</li>
            <li>{t('engine3')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('exportTitle')}</h2>
          <p className={styles.paragraph}>{t('exportDesc')}</p>
          <ul className={styles.bulletList}>
            <li>{t('export1')}</li>
            <li>{t('export2')}</li>
            <li>{t('export3')}</li>
            <li>{t('export4')}</li>
          </ul>
        </section>

        <section className={styles.seoSection}>
          <div className={styles.seoHead}>
            <h2 className={styles.seoTitle}>{t('faqTitle')}</h2>
            <p className={styles.seoSub}>{t('faqSub')}</p>
          </div>
          <FAQSection keys={WEBP_FAQ_KEYS} />
        </section>

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
