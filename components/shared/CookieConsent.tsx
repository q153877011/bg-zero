'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Cookie, X } from 'lucide-react'
import { loadConsent, saveConsent, pushConsentUpdate, isLikelyInEUEEA } from '@/lib/consent'
import styles from './CookieConsent.module.css'

export default function CookieConsent() {
  const t = useTranslations('consent')
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Delay showing to avoid blocking FCP / CLS
    const id = setTimeout(() => {
      const status = loadConsent()
      if (status !== 'pending') {
        // Already decided in the past — don't bother the user
        setMounted(true)
        return
      }

      // For users outside the EU/EEA/UK, GDPR / UK GDPR do not apply.
      // Silently auto-grant to avoid cookie banner fatigue, consistent with
      // industry practice (Google, Meta, etc. only show consent UI in GDPR regions).
      if (!isLikelyInEUEEA()) {
        saveConsent('granted')
        pushConsentUpdate('granted')
        setMounted(true)
        return
      }

      // EU/EEA/UK user with no prior choice → show the banner
      setVisible(true)
      setMounted(true)
    }, 800)
    return () => clearTimeout(id)
  }, [])

  function handleAccept() {
    saveConsent('granted')
    pushConsentUpdate('granted')
    setVisible(false)
  }

  function handleReject() {
    saveConsent('denied')
    pushConsentUpdate('denied')
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <div
      className={styles.wrapper}
      role="dialog"
      aria-label={t('ariaLabel')}
      aria-describedby="consent-description"
    >
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Cookie size={18} />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p id="consent-description" className={styles.description}>
            {t.rich('description', {
              privacy: (chunks) => (
                <Link href="/privacy" className={styles.link}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnReject}
            onClick={handleReject}
            aria-label={t('rejectAria')}
          >
            {t('reject')}
          </button>
          <button
            type="button"
            className={styles.btnAccept}
            onClick={handleAccept}
            aria-label={t('acceptAria')}
          >
            {t('accept')}
          </button>
        </div>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleReject}
          aria-label={t('close')}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
