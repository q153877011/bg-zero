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
        <Link href="/privacy" prefetch={false} className={styles['f-legal-link']}>{tl('privacyPolicy')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <Link href="/terms" prefetch={false} className={styles['f-legal-link']}>{tl('termsOfService')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <Link href="/licenses" prefetch={false} className={styles['f-legal-link']}>{tl('licenses')}</Link>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <a
          href="https://github.com/q153877011/bg-zero"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['f-legal-link']}
        >
          {tl('sourceCode')} (AGPL-3.0)
        </a>
        <span className={styles['f-legal-sep']} aria-hidden="true" />
        <a href="mailto:abuse@bg-zero.online" className={styles['f-legal-link']}>
          {tl('reportAbuse')}
        </a>
      </div>

      {/* Bottom bar */}
      <div className={styles['f-bottom']}>
        <span>&copy; {new Date().getFullYear()} BG Zero. {tl('agplNotice')}</span>
        <span className={styles['f-sep']} aria-hidden="true" />
        <span>{t('footerMotto')}</span>
        <span className={styles['f-sep']} aria-hidden="true" />
        <a
          href="https://github.com/q153877011/bg-zero"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['f-github']}
          aria-label="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
    </footer>
  )
}
