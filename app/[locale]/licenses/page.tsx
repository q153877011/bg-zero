'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from '../legal.module.css'

export default function LicensesPage() {
  const t = useTranslations('licenses')
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
          <p className={styles.legalDate}>{t('intro')}</p>
        </header>

        <div className={styles.legalContent}>
          {/* AGPL-3.0 */}
          <div className={styles.licenseGroup}>
            <p className={styles.licenseGroupTitle}>{t('agplSection')}</p>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>@imgly/background-removal</span>
              <span className={styles.licenseBadge}>AGPL-3.0</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>BG-Zero (this project)</span>
              <span className={styles.licenseBadge}>AGPL-3.0</span>
            </div>
          </div>

          {/* Apache-2.0 */}
          <div className={styles.licenseGroup}>
            <p className={styles.licenseGroupTitle}>{t('apacheSection')}</p>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>@huggingface/transformers</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>Apache-2.0</span>
            </div>
          </div>

          {/* MIT */}
          <div className={styles.licenseGroup}>
            <p className={styles.licenseGroupTitle}>{t('mitSection')}</p>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>next</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>react / react-dom</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>@bunnio/rembg-web</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>better-auth</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>pg</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>resend</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>lucide-react</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>ISC</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>tailwindcss</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>chart.js</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>next-intl</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>file-saver</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>MIT</span>
            </div>
          </div>

          {/* Models */}
          <div className={styles.licenseGroup}>
            <p className={styles.licenseGroupTitle}>{t('modelsSection')}</p>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>IS-Net (fp16) via @imgly</span>
              <span className={styles.licenseBadge}>AGPL-3.0</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>RMBG-1.4 (briaai)</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeWarn}`}>CC BY-NC 4.0 — {t('nonCommercialNote')}</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>U2-Net / U2-NetP / Silueta</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>Apache-2.0</span>
            </div>
            <div className={styles.licenseItem}>
              <span className={styles.licenseName}>IS-Net (general/anime)</span>
              <span className={`${styles.licenseBadge} ${styles.licenseBadgeGreen}`}>Apache-2.0</span>
            </div>
          </div>

          <p>
            <a href="https://github.com/bg-zero/bg-zero-next" target="_blank" rel="noopener noreferrer">
              {t('viewOnGithub')} &rarr;
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
