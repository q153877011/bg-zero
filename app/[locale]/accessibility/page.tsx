'use client'

import { useTranslations } from 'next-intl'
import BackLink from '@/components/shared/BackLink'
import styles from '../legal.module.css'

export default function AccessibilityPage() {
  const t = useTranslations('accessibility')

  return (
    <div className={styles.legalPage}>
      <div className={styles.legalInner}>
        <BackLink />

        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>{t('heading')}</h1>
        </header>

        <div className={styles.legalContent}>
          <p>{t('intro')}</p>

          <h2>{t('statusTitle')}</h2>
          <p>{t('status')}</p>

          <h2>{t('measuresTitle')}</h2>
          <ul>
            <li>{t('measure1')}</li>
            <li>{t('measure2')}</li>
            <li>{t('measure3')}</li>
            <li>{t('measure4')}</li>
            <li>{t('measure5')}</li>
            <li>{t('measure6')}</li>
          </ul>

          <h2>{t('knownIssuesTitle')}</h2>
          <p>{t('knownIssues')}</p>

          <h2>{t('feedbackTitle')}</h2>
          <p>{t('feedback')}</p>

          <h2>{t('enforcementTitle')}</h2>
          <p>{t('enforcement')}</p>
        </div>
      </div>
    </div>
  )
}
