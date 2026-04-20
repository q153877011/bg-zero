'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from '../legal.module.css'

export default function DmcaPage() {
  const t = useTranslations('dmca')
  const tl = useTranslations('legal')

  return (
    <div className={styles.legalPage}>
      <div className={styles.legalInner}>
        <Link href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tl('backToHome')}
        </Link>

        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>{t('heading')}</h1>
        </header>

        <div className={styles.legalContent}>
          <p>{t('intro')}</p>

          <h2>{t('websiteContentTitle')}</h2>
          <p>{t('websiteContent')}</p>
          <p><strong>{t('email')}</strong></p>

          <h2>{t('requirementsTitle')}</h2>
          <p>{t('requirementsIntro')}</p>
          <ul>
            <li>{t('req1')}</li>
            <li>{t('req2')}</li>
            <li>{t('req3')}</li>
            <li>{t('req4')}</li>
            <li>{t('req5')}</li>
            <li>{t('req6')}</li>
          </ul>

          <h2>{t('responseTitle')}</h2>
          <p>{t('response')}</p>
        </div>
      </div>
    </div>
  )
}
