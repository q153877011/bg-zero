'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from '../legal.module.css'

export default function PrivacyPage() {
  const t = useTranslations('privacy')
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
          <h2>{t('introTitle')}</h2>
          <p>{t('intro')}</p>

          <h2>{t('imageProcessingTitle')}</h2>
          <p><strong>{t('imageProcessing')}</strong></p>

          <h2>{t('dataWeCollectTitle')}</h2>
          <p>{t('dataWeCollectIntro')}</p>
          <ul>
            <li>{t('dataEmail')}</li>
            <li>{t('dataPassword')}</li>
            <li>{t('dataOAuth')}</li>
            <li>{t('dataSession')}</li>
            <li>{t('dataAnalytics')}</li>
            <li>{t('dataLogs')}</li>
          </ul>

          <h2>{t('legalBasisTitle')}</h2>
          <p>{t('legalBasis')}</p>

          <h2>{t('thirdPartyTitle')}</h2>
          <p>{t('thirdPartyIntro')}</p>
          <ul>
            <li>{t('thirdPartyHosting')}</li>
            <li>{t('thirdPartyDB')}</li>
            <li>{t('thirdPartyResend')}</li>
            <li>{t('thirdPartyGoogle')}</li>
            <li>{t('thirdPartyHF')}</li>
          </ul>

          <h2>{t('retentionTitle')}</h2>
          <p>{t('retention')}</p>

          <h2>{t('yourRightsTitle')}</h2>
          <p>{t('yourRightsIntro')}</p>
          <ul>
            <li><strong>{t('rightAccess')}</strong></li>
            <li><strong>{t('rightCorrection')}</strong></li>
            <li><strong>{t('rightDeletion')}</strong></li>
            <li><strong>{t('rightPortability')}</strong></li>
            <li><strong>{t('rightObjection')}</strong></li>
            <li><strong>{t('rightWithdraw')}</strong></li>
          </ul>
          <p>{t('rightsExercise')}</p>

          <h2>{t('childrenTitle')}</h2>
          <p>{t('children')}</p>

          <h2>{t('securityTitle')}</h2>
          <p>{t('security')}</p>

          <h2>{t('internationalTitle')}</h2>
          <p>{t('international')}</p>

          <h2>{t('changesTitle')}</h2>
          <p>{t('changes')}</p>

          <h2>{t('contactTitle')}</h2>
          <p>{t('contact')}</p>

          <h2>{t('supervisoryTitle')}</h2>
          <p>{t('supervisory')}</p>
        </div>
      </div>
    </div>
  )
}
