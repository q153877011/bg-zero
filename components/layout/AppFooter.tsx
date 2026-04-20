'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from './AppFooter.module.css'

export default function AppFooter() {
  const t = useTranslations('common')
  const tl = useTranslations('legal')
  return (
    <footer className={styles['app-footer']} role="contentinfo">
      {/* Decorative background layer */}
      <div className={styles['f-bg']} aria-hidden="true">
        <div className={styles['f-bg-checker']} />
        <div className={styles['f-bg-glow']} />
        <span className={styles['f-watermark']}>BG ZERO</span>
      </div>

      {/* Privacy banner */}
      <div className={styles['f-privacy-row']}>
        <div className={styles['f-privacy-pill']}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M6.5 1L11.5 3.5V7C11.5 9.5 9.3 11.7 6.5 12.5C3.7 11.7 1.5 9.5 1.5 7V3.5L6.5 1Z"
              stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
            />
            <path
              d="M4.5 6.5L6 8L8.5 5.5"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          {t('privacyBanner')}
        </div>
      </div>

      {/* Divider */}
      <div className={styles['f-rule']} aria-hidden="true" />

      {/* Main footer row */}
      <div className={styles['f-inner']}>
        {/* Brand */}
        <div className={styles['f-brand']}>
          <div className={styles['f-logo']}>
            <div className={styles['f-logo-mark']}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.12" />
                <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.35" />
                <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.92" />
              </svg>
            </div>
            <span className={styles['f-logo-name']}>
              BG<span className={styles['f-logo-thin']}>Zero</span>
            </span>
          </div>
          <p className={styles['f-tagline']}>
            {t('footerTagline').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </p>
        </div>

        {/* Licenses */}
        <div className={styles['f-licenses']}>
          <p className={styles['f-lic-label']}>{t('openSourceLicense')}</p>
          <ul className={styles['f-lic-list']} role="list">
            <li className={styles['f-lic-item']}>
              <span className={styles['f-lic-name']}>{t('defaultEngine')}</span>
              <span className={styles['f-lic-badge']}>AGPL-3.0</span>
            </li>
            <li className={styles['f-lic-item']}>
              <span className={styles['f-lic-name']}>Transformers.js</span>
              <a
                href="https://huggingface.co/briaai/RMBG-1.4"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['f-lic-badge']} ${styles['f-lic-badge--warn']}`}
                title="RMBG-1.4 non-commercial use only"
              >
                CC BY-NC 4.0
              </a>
            </li>
            <li className={styles['f-lic-item']}>
              <span className={styles['f-lic-name']}>rembg-web</span>
              <span className={`${styles['f-lic-badge']} ${styles['f-lic-badge--green']}`}>MIT</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal links row */}
      <div className={styles['f-legal-row']}>
        <Link href="/privacy" className={styles['f-legal-link']}>{tl('privacyPolicy')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <Link href="/terms" className={styles['f-legal-link']}>{tl('termsOfService')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <Link href="/licenses" className={styles['f-legal-link']}>{tl('licenses')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <a
          href="https://github.com/bg-zero/bg-zero-next"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['f-legal-link']}
        >
          {tl('sourceCode')} (AGPL-3.0)
        </a>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <a href="mailto:abuse@bg-zero.tech" className={styles['f-legal-link']}>
          {tl('reportAbuse')}
        </a>
      </div>

      {/* Bottom bar */}
      <div className={styles['f-bottom']}>
        <span>&copy; {new Date().getFullYear()} BG Zero. {tl('agplNotice')}</span>
        <span className={styles['f-sep']} aria-hidden="true" />
        <span>{t('footerMotto')}</span>
      </div>
    </footer>
  )
}
