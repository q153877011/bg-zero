'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from '../legal.module.css'

export default function TermsPage() {
  const t = useTranslations('terms')
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
          <p className={styles.legalDate}>{t('effectiveDate')}</p>
        </header>

        <div className={styles.legalContent}>
          <h2>{t('acceptanceTitle')}</h2>
          <p>{t('acceptance')}</p>

          <h2>{t('serviceDescTitle')}</h2>
          <p>{t('serviceDesc')}</p>

          <h2>{t('noWarrantyTitle')}</h2>
          <p>{t('noWarranty')}</p>

          <h2>{t('accountTitle')}</h2>
          <p>{t('account')}</p>

          <h2>{t('prohibitedTitle')}</h2>
          <p>{t('prohibitedIntro')}</p>
          <ul>
            <li>{t('prohibited1')}</li>
            <li>{t('prohibited2')}</li>
            <li>{t('prohibited3')}</li>
            <li>{t('prohibited4')}</li>
            <li>{t('prohibited5')}</li>
            <li>{t('prohibited6')}</li>
          </ul>

          <h2>{t('contentTitle')}</h2>
          <p>{t('content')}</p>

          <h2>{t('ipTitle')}</h2>
          <p>{t('ip')}</p>

          <h2>{t('modelLicenseTitle')}</h2>
          <p>{t('modelLicense')}</p>

          <h2>{t('terminationTitle')}</h2>
          <p>{t('termination')}</p>

          <h2>{t('limitationTitle')}</h2>
          <p>{t('limitation')}</p>

          <h2>{t('indemnityTitle')}</h2>
          <p>{t('indemnity')}</p>

          <h2>{t('governingLawTitle')}</h2>
          <p>{t('governingLaw')}</p>

          <h2>{t('changesTitle')}</h2>
          <p>{t('changes')}</p>

          <h2>{t('contactTitle')}</h2>
          <p>{t('contact')}</p>

          <h2>{t('abuseTitle')}</h2>
          <p>{t('abuse')}</p>
        </div>
      </div>
    </div>
  )
}
