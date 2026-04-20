'use client'

import { useTranslations } from 'next-intl'
import BackLink from '@/components/shared/BackLink'
import styles from '../legal.module.css'

export default function DmcaPage() {
  const t = useTranslations('dmca')

  return (
    <div className={styles.legalPage}>
      <div className={styles.legalInner}>
        <BackLink />

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
