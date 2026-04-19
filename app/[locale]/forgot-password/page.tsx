'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import styles from './page.module.css'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

// definePageMeta({ auth: 'guest' }) — handled by proxy

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current) }
  }, [])

  function startCooldown(seconds = 60) {
    setCooldown(seconds)
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { if (cooldownRef.current) clearInterval(cooldownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function validateEmail(): boolean {
    let err = ''
    if (!email) err = t('errEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err = t('errEmailInvalid')
    setEmailError(err)
    return !err
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!validateEmail()) return

    setIsLoading(true)
    setAuthError('')

    try {
      await (authClient as any).forgetPassword({ email, redirectTo: '/reset-password' })
      setSubmittedEmail(email)
      setSent(true)
      startCooldown()
    } catch {
      setAuthError(t('errIfRegistered'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.fpPage}>

      <div className={styles.fpBg} aria-hidden="true">
        <div className={styles.fpbNoise} />
        <div className={`${styles.fpbGlow} ${styles.fpbGlow1}`} />
        <div className={`${styles.fpbGlow} ${styles.fpbGlow2}`} />
      </div>

      <div className={styles.fpWrap}>
        <Link href="/login" className={styles.fpBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tc('backToLogin')}
        </Link>

        <div className={styles.fpCard}>

          <div className="flex justify-end mb-3">
            <LanguageSwitcher />
          </div>

          {sent ? (
            <div className={styles.fpSuccess}>
              <div className={styles.fpsIcon} aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="21" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5"/>
                  <path d="M10 22h24M22 10l8 12-8 12" stroke="rgba(129,140,248,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 17h16v10H14V17zm0 0l8 6 8-6" stroke="rgba(129,140,248,0.55)" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <h1 className={styles.fpsTitle}>{t('emailSent')}</h1>
              <p className={styles.fpsDesc}>
                {t('resetLinkSent')}<br/>
                <strong>{submittedEmail}</strong>
              </p>
              <p className={styles.fpsHint}>{t('resetLinkExpiry')}</p>
              <button className={styles.fpsResend} disabled={cooldown > 0} onClick={() => handleSubmit()}>
                {cooldown > 0 ? t('resendInSeconds', { seconds: cooldown }) : t('resend')}
              </button>
              <Link href="/login" className={styles.fpsBackLogin}>{tc('backToLogin')}</Link>
            </div>
          ) : (
            <div>
              <div className={styles.fpcHeader}>
                <div className={styles.fpcLogo} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.12"/>
                    <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.32"/>
                    <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.92"/>
                  </svg>
                </div>
                <h1 className={styles.fpcTitle}>{t('forgotTitle')}</h1>
                <p className={styles.fpcSub}>{t('forgotSub')}</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.fpcField}>
                  <label className={styles.fpcLabel} htmlFor="fp-email">{t('forgotEmailLabel')}</label>
                  <div className={`${styles.fpcInputWrap} ${emailError ? styles.fpcInputWrapError : ''}`}>
                    <svg className={styles.fpcIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M1 3h13v9H1V3zm0 0l6.5 5L14 3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                    <input
                      id="fp-email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      className={styles.fpcInput}
                      placeholder="email@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      onBlur={validateEmail}
                    />
                  </div>
                  {emailError && <p className={styles.fpcError}>{emailError}</p>}
                </div>

                {authError && (
                  <div className={styles.fpcAuthError} role="alert">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 4.5V7.5M7 9.5v.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {authError}
                  </div>
                )}

                <button type="submit" className={styles.fpcSubmit} disabled={isLoading}>
                  {isLoading && <span className={styles.fpcSpinner} aria-hidden="true" />}
                  <span>{isLoading ? t('sendingLink') : t('sendResetLink')}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
