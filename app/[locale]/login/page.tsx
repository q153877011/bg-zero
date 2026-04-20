'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { signIn } from '@/lib/auth-client'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import AuthRedirectOverlay from '@/components/auth/AuthRedirectOverlay'
import styles from './page.module.css'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

// definePageMeta({ auth: 'guest' }) — handled by proxy

export default function LoginPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const { track } = useAnalytics()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [redirectingProvider, setRedirectingProvider] = useState<'google' | null>(null)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  const features = [
    { ico: '◈', text: t('leftPanelFeature1') },
    { ico: '◉', text: t('leftPanelFeature2') },
    { ico: '◎', text: t('leftPanelFeature3') },
  ]

  const privacy = [
    t('privacyLine1'),
    t('privacyLine2'),
  ]

  function validateEmail() {
    let err = ''
    if (!form.email) err = t('errEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err = t('errEmailInvalid')
    setErrors(prev => ({ ...prev, email: err }))
    return err
  }

  function validatePassword() {
    let err = ''
    if (!form.password) err = t('errPasswordRequired')
    setErrors(prev => ({ ...prev, password: err }))
    return err
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    setRedirectingProvider('google')
    setAuthError(null)
    try {
      await signIn.social({ provider: 'google', callbackURL: '/auto' })
      track('sign_in', { provider: 'google' })
    } catch {
      setRedirectingProvider(null)
      setAuthError(t('errGoogleFailed'))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault()
    const emailErr = validateEmail()
    const pwErr = validatePassword()
    if (emailErr || pwErr) return

    setIsEmailLoading(true)
    setAuthError(null)

    try {
      await signIn.email({ email: form.email, password: form.password, callbackURL: '/auto' })
      track('sign_in', { provider: 'email' })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('verified') || msg.includes('verification')) {
        setAuthError(t('errVerifyEmail'))
      } else {
        setAuthError(t('errLoginFailed'))
      }
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>

      {/* ── Ambient background ── */}
      <div className={styles.lpBg} aria-hidden="true">
        <div className={styles.lpbNoise} />
        <div className={`${styles.lpbGlow} ${styles.lpbGlow1}`} />
        <div className={`${styles.lpbGlow} ${styles.lpbGlow2}`} />
      </div>

      {/* ══ LEFT — Brand panel ══ */}
      <div className={styles.lpLeft}>
        <Link href="/" className={styles.lpBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tc('backToHome')}
        </Link>

        <div className={styles.lpDiamondWrap} aria-hidden="true">
          <div className={`${styles.lpDiamond} ${styles.lpD1}`} />
          <div className={`${styles.lpDiamond} ${styles.lpD2}`} />
          <div className={`${styles.lpDiamond} ${styles.lpD3}`} />
          <div className={styles.lpDiamondCore}>
            <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.10"/>
              <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.28"/>
              <circle cx="9" cy="9" r="2.8" fill="white" fillOpacity="0.90"/>
            </svg>
          </div>
        </div>

        <div className={styles.lpManifesto}>
          <h2 className={styles.lpmTitle}>
            {t('leftPanelLoginTitle')}<br />
            <span className={styles.lpmAccent}>{t('leftPanelLoginAccent')}</span>
          </h2>
          <ul className={styles.lpmFeats} role="list">
            {features.map((f) => (
              <li key={f.text} className={styles.lpmFeat}>
                <span className={styles.lpmFeatIco} aria-hidden="true">{f.ico}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.lpWordmark} aria-hidden="true">BG ZERO</div>
      </div>

      {/* ══ RIGHT — Auth panel ══ */}
      <div className={styles.lpRight}>
        <div className={styles.lpCard}>

          <div className="flex justify-end mb-3">
            <LanguageSwitcher />
          </div>

          {/* Mobile back link */}
          <Link href="/" className={styles.lpMobileBack}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {tc('backToHome')}
          </Link>

          {/* Header */}
          <div className={styles.lpcHeader}>
            <div className={styles.lpcLogo}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.12"/>
                <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.32"/>
                <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.92"/>
              </svg>
            </div>
            <h1 className={styles.lpcTitle}>{t('welcomeBack')}</h1>
            <p className={styles.lpcSub}>{t('loginSub')}</p>
          </div>

          {/* Google button */}
          <button
            className={styles.lpcGoogle}
            disabled={isGoogleLoading || isEmailLoading}
            onClick={signInWithGoogle}
            aria-label={t('googleLogin')}
          >
            <span className={styles.lpgContent}>
              {isGoogleLoading ? (
                <>
                  <span className={styles.lpgSpinner} aria-hidden="true" />
                  <span>{t('googleRedirecting')}</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48" className={styles.lpgIcon} aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{t('googleLogin')}</span>
                </>
              )}
            </span>
            <span className={styles.lpgFill} aria-hidden="true" />
          </button>

          {/* ── Email divider ── */}
          <div className={styles.lpcDivider} role="separator">
            <span className={styles.lpdLine} /><span className={styles.lpdText}>{t('dividerEmail')}</span><span className={styles.lpdLine} />
          </div>

          {/* ── Email + Password form ── */}
          <form className={`${styles.lpcForm} ${isEmailLoading ? styles.lpcFormPending : ''}`} onSubmit={signInWithEmail} noValidate>
            {/* Email */}
            <div className={styles.lfField}>
              <label className={styles.lfLabel} htmlFor="login-email">{t('emailLabel')}</label>
              <div className={`${styles.lfInputWrap} ${errors.email ? styles.lfInputWrapError : ''}`}>
                <svg className={styles.lfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M1 3h13v9H1V3zm0 0l6.5 5L14 3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                <input
                  id="login-email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  type="email"
                  className={styles.lfInput}
                  placeholder="email@example.com"
                  autoComplete="email"
                  disabled={isEmailLoading}
                  onBlur={validateEmail}
                />
              </div>
              {errors.email && <p className={styles.lfError}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={styles.lfField}>
              <label className={styles.lfLabel} htmlFor="login-password">{t('passwordLabel')}</label>
              <div className={`${styles.lfInputWrap} ${errors.password ? styles.lfInputWrapError : ''}`}>
                <svg className={styles.lfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="2" y="6.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4.5 6.5V4.5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
                </svg>
                <input
                  id="login-password"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  type={showPassword ? 'text' : 'password'}
                  className={styles.lfInput}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isEmailLoading}
                  onBlur={validatePassword}
                />
                <button
                  type="button"
                  className={styles.lfEye}
                  aria-label={showPassword ? tc('hidePassword') : tc('showPassword')}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2.5 13.5l11-11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className={styles.lfError}>{errors.password}</p>}
            </div>

            {/* Global error */}
            {authError && (
              <div className={styles.lfAuthError} role="alert">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 4.5V7.5M7 9.5v.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {authError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={styles.lfSubmit}
              disabled={isEmailLoading || isGoogleLoading}
            >
              {isEmailLoading && <span className={styles.lfSubmitSpinner} aria-hidden="true" />}
              <span>{isEmailLoading ? t('loginLoading') : t('loginBtn')}</span>
            </button>
          </form>

          {/* ── Footer links ── */}
          <div className={styles.lpcLinks}>
            <span className={styles.lpcLinksLeft}>
              {t('noAccount')}
              <Link href="/register" className={styles.lplLink}>{t('register')}</Link>
            </span>
            <Link href="/forgot-password" className={styles.lplLink}>{t('forgotPassword')}</Link>
          </div>

          {/* ── Privacy ── */}
          <div className={styles.lpcDivider} role="separator">
            <span className={styles.lpdLine} /><span className={styles.lpdText}>{t('privacyDivider')}</span><span className={styles.lpdLine} />
          </div>

          <div className={styles.lpcPrivacy}>
            {privacy.map((p) => (
              <div key={p} className={styles.lpvRow}>
                <span className={styles.lpvDot} aria-hidden="true" />
                {p}
              </div>
            ))}
          </div>

          {/* Legal */}
          <p className={styles.lpcLegal}>
            {t('legalText')}
            <Link href="/terms" className={styles.lplLink}>{t('termsOfService')}</Link>{t('and')}
            <Link href="/privacy" className={styles.lplLink}>{t('privacyPolicy')}</Link>
          </p>

        </div>
      </div>

      <AuthRedirectOverlay
        provider={redirectingProvider}
        message={t('googleRedirecting')}
        subtitle={tc('redirectingBack')}
      />
    </div>
  )
}
