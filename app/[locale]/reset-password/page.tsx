'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import styles from './page.module.css'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

// definePageMeta({ auth: 'guest' }) — handled by proxy

function getStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return { level: 'weak' as const, pct: 33 }
  if (score <= 3) return { level: 'medium' as const, pct: 66 }
  return { level: 'strong' as const, pct: 100 }
}

function ResetPasswordContent() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({ password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(3)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const strength = form.password ? getStrength(form.password) : null

  const strengthLabels: Record<string, string> = {
    weak: t('strengthWeak'),
    medium: t('strengthMedium'),
    strong: t('strengthStrong'),
  }

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [])

  function startAutoRedirect() {
    setAutoRedirectCountdown(3)
    countdownRef.current = setInterval(() => {
      setAutoRedirectCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function validatePassword(): boolean {
    let err = ''
    if (!form.password) err = t('errPasswordRequired')
    else if (form.password.length < 8) err = t('errPasswordMin')
    setErrors(prev => ({ ...prev, password: err }))
    return !err
  }

  function validateConfirm(): boolean {
    let err = ''
    if (!form.confirm) err = t('errConfirmRequired')
    else if (form.confirm !== form.password) err = t('errConfirmMismatch')
    setErrors(prev => ({ ...prev, confirm: err }))
    return !err
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const p = validatePassword()
    const c = validateConfirm()
    if (!p || !c) return
    if (!token) return

    if (strength?.level === 'weak') {
      setErrors(prev => ({ ...prev, password: t('errWeakPassword') }))
      return
    }

    setIsLoading(true)
    setAuthError('')

    try {
      await authClient.resetPassword({ newPassword: form.password, token })
      setDone(true)
      startAutoRedirect()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
        setAuthError(t('errResetLinkExpired'))
      } else {
        setAuthError(t('errResetFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const strengthLevelMap = { weak: 'Weak', medium: 'Medium', strong: 'Strong' }

  return (
    <div className={styles.rpPage}>

      <div className={styles.rpBg} aria-hidden="true">
        <div className={styles.rpbNoise} />
        <div className={`${styles.rpbGlow} ${styles.rpbGlow1}`} />
        <div className={`${styles.rpbGlow} ${styles.rpbGlow2}`} />
      </div>

      <div className={styles.rpWrap}>
        <Link href="/login" className={styles.rpBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tc('backToLogin')}
        </Link>

        <div className={styles.rpCard}>

          <div className="flex justify-end mb-3">
            <LanguageSwitcher />
          </div>

          {!token ? (
            <div className={styles.rpInvalid}>
              <div className={styles.rpiIcon} aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="21" stroke="rgba(239,68,68,0.35)" strokeWidth="1.5"/>
                  <path d="M15 15l14 14M29 15L15 29" stroke="rgba(248,113,113,0.70)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className={styles.rpiTitle}>{t('invalidLink')}</h1>
              <p className={styles.rpiDesc}>{t('invalidLinkDesc')}</p>
              <Link href="/forgot-password" className={styles.rpiBtn}>{t('requestNewReset')}</Link>
            </div>
          ) : done ? (
            <div className={styles.rpSuccess}>
              <div className={styles.rpsIcon} aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="21" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5"/>
                  <path d="M14 22l6 6 10-12" stroke="rgba(129,140,248,0.80)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className={styles.rpsTitle}>{t('resetSuccess')}</h1>
              <p className={styles.rpsDesc}>{t('resetSuccessDesc')}<br/>{t('autoRedirect', { seconds: autoRedirectCountdown })}</p>
              <Link href="/login" className={styles.rpsBtn}>{t('goLoginNow')}</Link>
            </div>
          ) : (
            <div>
              <div className={styles.rpcHeader}>
                <div className={styles.rpcLogo} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.12"/>
                    <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.32"/>
                    <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.92"/>
                  </svg>
                </div>
                <h1 className={styles.rpcTitle}>{t('resetTitle')}</h1>
                <p className={styles.rpcSub}>{t('resetSub')}</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* New password */}
                <div className={styles.rpcField}>
                  <label className={styles.rpcLabel} htmlFor="rp-password">{t('newPasswordLabel')}</label>
                  <div className={`${styles.rpcInputWrap} ${errors.password ? styles.rpcInputWrapError : ''}`}>
                    <svg className={styles.rpcIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <rect x="2" y="6" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <input id="rp-password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} type={showPassword ? 'text' : 'password'} className={styles.rpcInput} placeholder={t('atLeast8Chars')} autoComplete="new-password" disabled={isLoading} onBlur={validatePassword} />
                    <button type="button" className={styles.rpcEye} aria-label={showPassword ? tc('hidePassword') : tc('showPassword')} onClick={() => setShowPassword(!showPassword)}>
                      {!showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4.2 4.3C2.7 5.4 1.5 7 1 8c1.3 2.6 4 5 7 5a7.5 7.5 0 003.8-1M7 3.1C7.3 3 7.7 3 8 3c3 0 5.7 2.4 7 5-.4.9-1 1.7-1.7 2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                  </div>
                  {strength && (
                    <div className={styles.rpcStrength}>
                      <div className={styles.rpcStrengthBar}>
                        <div className={`${styles.rpcStrengthFill} ${styles[`rpcStrengthFill${strengthLevelMap[strength.level]}`]}`} style={{ width: strength.pct + '%' }} />
                      </div>
                      <span className={`${styles.rpcStrengthLabel} ${styles[`rpcStrengthLabel${strengthLevelMap[strength.level]}`]}`}>{strengthLabels[strength.level]}</span>
                    </div>
                  )}
                  {errors.password && <p className={styles.rpcError}>{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className={styles.rpcField}>
                  <label className={styles.rpcLabel} htmlFor="rp-confirm">{t('confirmPasswordLabel')}</label>
                  <div className={`${styles.rpcInputWrap} ${errors.confirm ? styles.rpcInputWrapError : ''}`}>
                    <svg className={styles.rpcIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <rect x="2" y="6" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <input id="rp-confirm" value={form.confirm} onChange={e => setForm(prev => ({ ...prev, confirm: e.target.value }))} type={showConfirm ? 'text' : 'password'} className={styles.rpcInput} placeholder={t('confirmPasswordPlaceholder')} autoComplete="new-password" disabled={isLoading} onBlur={validateConfirm} />
                    <button type="button" className={styles.rpcEye} aria-label={showConfirm ? tc('hidePassword') : tc('showPassword')} onClick={() => setShowConfirm(!showConfirm)}>
                      {!showConfirm ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4.2 4.3C2.7 5.4 1.5 7 1 8c1.3 2.6 4 5 7 5a7.5 7.5 0 003.8-1M7 3.1C7.3 3 7.7 3 8 3c3 0 5.7 2.4 7 5-.4.9-1 1.7-1.7 2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm && <p className={styles.rpcError}>{errors.confirm}</p>}
                </div>

                {authError && (
                  <div className={styles.rpcAuthError} role="alert">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 4.5V7.5M7 9.5v.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {authError}
                  </div>
                )}

                <button type="submit" className={styles.rpcSubmit} disabled={isLoading}>
                  {isLoading && <span className={styles.rpcSpinner} aria-hidden="true" />}
                  <span>{isLoading ? t('resetting') : t('resetBtn')}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className={styles.rpPage} />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
