'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { signUp } from '@/lib/auth-client'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
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

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const { track } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' })

  const strength = form.password ? getStrength(form.password) : null

  const strengthLabels: Record<string, string> = {
    weak: t('strengthWeak'),
    medium: t('strengthMedium'),
    strong: t('strengthStrong'),
  }

  const features = [
    { ico: '◈', text: t('leftPanelRegFeature1') },
    { ico: '◉', text: t('leftPanelRegFeature2') },
    { ico: '◎', text: t('leftPanelRegFeature3') },
  ]

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current) }
  }, [])

  function startCooldown(seconds = 60) {
    setResendCooldown(seconds)
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { if (cooldownRef.current) clearInterval(cooldownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

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
    else if (form.password.length < 8) err = t('errPasswordMin')
    setErrors(prev => ({ ...prev, password: err }))
    return err
  }

  function validateConfirm() {
    let err = ''
    if (!form.confirm) err = t('errConfirmRequired')
    else if (form.confirm !== form.password) err = t('errConfirmMismatch')
    setErrors(prev => ({ ...prev, confirm: err }))
    return err
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const emailErr = validateEmail()
    const pwErr = validatePassword()
    const cfmErr = validateConfirm()
    if (emailErr || pwErr || cfmErr) return

    setIsLoading(true)
    setAuthError(null)

    try {
      await signUp.email({
        email: form.email,
        password: form.password,
        name: form.name || form.email.split('@')[0],
        callbackURL: '/auto',
      })
      setRegistered(true)
      track('sign_up', { provider: 'email' })
      setForm(prev => ({ ...prev, password: '', confirm: '' }))
      startCooldown()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('exist') || msg.includes('already') || msg.includes('duplicate')) {
        setAuthError(t('errEmailExists'))
      } else {
        setAuthError(t('errRegisterFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function resendVerification() {
    if (resendCooldown > 0) return
    setResendError(null)
    try {
      await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      }).then(r => r.json())
      startCooldown()
    } catch {
      setResendError(t('resendFailed'))
    }
  }

  return (
    <div className={styles.regPage}>

      <div className={styles.rpBg} aria-hidden="true">
        <div className={styles.rpbNoise} />
        <div className={`${styles.rpbGlow} ${styles.rpbGlow1}`} />
        <div className={`${styles.rpbGlow} ${styles.rpbGlow2}`} />
      </div>

      {/* ══ LEFT ══ */}
      <div className={styles.rpLeft}>
        <Link href="/" className={styles.rpBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tc('backToHome')}
        </Link>

        <div className={styles.rpDiamondWrap} aria-hidden="true">
          <div className={`${styles.rpDiamond} ${styles.rpD1}`} />
          <div className={`${styles.rpDiamond} ${styles.rpD2}`} />
          <div className={`${styles.rpDiamond} ${styles.rpD3}`} />
          <div className={styles.rpDiamondCore}>
            <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.10"/>
              <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.28"/>
              <circle cx="9" cy="9" r="2.8" fill="white" fillOpacity="0.90"/>
            </svg>
          </div>
        </div>

        <div className={styles.rpManifesto}>
          <h2 className={styles.rpmTitle}>
            {t('leftPanelRegTitle')}<br />
            <span className={styles.rpmAccent}>{t('leftPanelRegAccent')}</span>
          </h2>
          <ul className={styles.rpmFeats} role="list">
            {features.map((f) => (
              <li key={f.text} className={styles.rpmFeat}>
                <span className={styles.rpmFeatIco} aria-hidden="true">{f.ico}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.rpWordmark} aria-hidden="true">BG ZERO</div>
      </div>

      {/* ══ RIGHT ══ */}
      <div className={styles.rpRight}>
        <div className={styles.rpCard}>

          <div className="flex justify-end mb-3">
            <LanguageSwitcher />
          </div>

          {registered ? (
            <div className={styles.rpcSuccess}>
              <div className={styles.rpsIcon} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5"/>
                  <path d="M8 14l4.5 4.5L20 9" stroke="rgba(34,197,94,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className={styles.rpsTitle}>{t('registerSuccess')}</h2>
              <p className={styles.rpsDesc}>
                {t('verifyEmailSent')} <strong>{form.email}</strong><br/>
                {t('verifyEmailAction')}
              </p>
              <p className={styles.rpsHint}>{t('verifyEmailHint')}</p>
              {resendError && <p className={styles.rpsResendError}>{resendError}</p>}
              <button className={styles.rpsResend} disabled={resendCooldown > 0} onClick={resendVerification}>
                {resendCooldown > 0 ? t('resendCooldown', { seconds: resendCooldown }) : t('resendVerification')}
              </button>
              <p className={styles.rpsLoginHint}>{t('verifyDoneHint')}</p>
              <Link href="/login" className={styles.rpsLoginLink}>{t('goLoginBtn')}</Link>
            </div>
          ) : (
            <div>
              <div className={styles.rpcHeader}>
                <div className={styles.rpcLogo}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="white" fillOpacity="0.12"/>
                    <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="white" fillOpacity="0.32"/>
                    <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.92"/>
                  </svg>
                </div>
                <h1 className={styles.rpcTitle}>{t('registerTitle')}</h1>
                <p className={styles.rpcSub}>{t('registerSub')}</p>
              </div>

              <form className={styles.rpcForm} onSubmit={handleRegister} noValidate>
                {/* Name */}
                <div className={styles.rfField}>
                  <label className={styles.rfLabel} htmlFor="reg-name">
                    {t('nameLabel')} <span className={styles.rfOptional}>{t('nameOptional')}</span>
                  </label>
                  <div className={styles.rfInputWrap}>
                    <svg className={styles.rfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2 13c0-2.5 2.5-4.5 5.5-4.5S13 10.5 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <input id="reg-name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} type="text" className={styles.rfInput} placeholder={t('namePlaceholder')} autoComplete="name" disabled={isLoading} />
                  </div>
                </div>

                {/* Email */}
                <div className={styles.rfField}>
                  <label className={styles.rfLabel} htmlFor="reg-email">{t('emailLabel')}</label>
                  <div className={`${styles.rfInputWrap} ${errors.email ? styles.rfInputWrapError : ''}`}>
                    <svg className={styles.rfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M1 3h13v9H1V3zm0 0l6.5 5L14 3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                    <input id="reg-email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} type="email" className={styles.rfInput} placeholder="email@example.com" autoComplete="email" disabled={isLoading} onBlur={validateEmail} />
                  </div>
                  {errors.email && <p className={styles.rfError}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div className={styles.rfField}>
                  <label className={styles.rfLabel} htmlFor="reg-password">{t('passwordLabel')}</label>
                  <div className={`${styles.rfInputWrap} ${errors.password ? styles.rfInputWrapError : ''}`}>
                    <svg className={styles.rfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <rect x="3" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <input id="reg-password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} type={showPassword ? 'text' : 'password'} className={styles.rfInput} placeholder={t('newPasswordPlaceholder')} autoComplete="new-password" disabled={isLoading} onBlur={validatePassword} />
                    <button type="button" className={styles.rfEye} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? tc('hidePassword') : tc('showPassword')}>
                      {!showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M2 2l11 11M6.39 6.46A1.8 1.8 0 0 0 9.54 9.6M4.08 4.12C2.56 5.1 1 7.5 1 7.5S3.5 12 7.5 12c1.1 0 2.1-.28 2.97-.75M6.5 3.07C6.83 3.02 7.16 3 7.5 3c4 0 6.5 4.5 6.5 4.5s-.58 1-1.61 2.08" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      )}
                    </button>
                  </div>
                  {strength && (
                    <div className={styles.rfStrength}>
                      <div className={styles.rfStrengthBar}>
                        <div className={`${styles.rfStrengthFill} ${styles[`rfStrengthFill${strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}`]}`} style={{ width: strength.pct + '%' }} />
                      </div>
                      <span className={`${styles.rfStrengthLabel} ${styles[strength.level + 'Text']}`}>{strengthLabels[strength.level]}</span>
                    </div>
                  )}
                  {errors.password && <p className={styles.rfError}>{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className={styles.rfField}>
                  <label className={styles.rfLabel} htmlFor="reg-confirm">{t('confirmPasswordLabel')}</label>
                  <div className={`${styles.rfInputWrap} ${errors.confirm ? styles.rfInputWrapError : ''}`}>
                    <svg className={styles.rfIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <rect x="3" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <input id="reg-confirm" value={form.confirm} onChange={e => setForm(prev => ({ ...prev, confirm: e.target.value }))} type={showConfirm ? 'text' : 'password'} className={styles.rfInput} placeholder={t('confirmPasswordPlaceholder')} autoComplete="new-password" disabled={isLoading} onBlur={validateConfirm} />
                    <button type="button" className={styles.rfEye} onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? tc('hidePassword') : tc('showPassword')}>
                      {!showConfirm ? (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M2 2l11 11M6.39 6.46A1.8 1.8 0 0 0 9.54 9.6M4.08 4.12C2.56 5.1 1 7.5 1 7.5S3.5 12 7.5 12c1.1 0 2.1-.28 2.97-.75M6.5 3.07C6.83 3.02 7.16 3 7.5 3c4 0 6.5 4.5 6.5 4.5s-.58 1-1.61 2.08" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm && <p className={styles.rfError}>{errors.confirm}</p>}
                </div>

                {/* Auth error */}
                {authError && (
                  <div className={styles.rfAuthError} role="alert">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 4.5V7.5M7 9.5v.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {authError}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className={styles.rfSubmit} disabled={isLoading}>
                  {isLoading && <span className={styles.rfSubmitSpinner} aria-hidden="true" />}
                  <span>{isLoading ? t('registerLoading') : t('registerBtn')}</span>
                </button>
              </form>

              <div className={styles.rpcFooterLink}>
                {t('hasAccount')}
                <Link href="/login" className={styles.rflLink}>{t('goLogin')}</Link>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
