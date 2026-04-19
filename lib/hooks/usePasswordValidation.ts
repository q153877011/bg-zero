'use client'

import { useMemo } from 'react'

/**
 * 统一密码校验
 * 供 register / reset-password / login 共用，保证前端密码策略一致
 */
export function usePasswordValidation() {
  const PASSWORD_MIN_LENGTH = 8

  function calcStrength(pw: string): number {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  function strengthPct(score: number): number {
    return Math.round((score / 6) * 100)
  }

  function strengthLevel(score: number): 'weak' | 'medium' | 'strong' {
    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    return 'strong'
  }

  function strengthText(score: number): string {
    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    return 'strong'
  }

  function validatePassword(password: string): string {
    if (!password) return 'errPasswordRequired'
    if (password.length < PASSWORD_MIN_LENGTH) return 'errPasswordMin'
    if (!/[A-Z]/.test(password)) return 'errPasswordUppercase'
    if (!/[a-z]/.test(password)) return 'errPasswordLowercase'
    if (!/[0-9]/.test(password)) return 'errPasswordDigit'
    return ''
  }

  function validateConfirm(confirm: string, password: string): string {
    if (!confirm) return 'errConfirmRequired'
    if (confirm !== password) return 'errConfirmMismatch'
    return ''
  }

  /**
   * 绑定到响应式密码字段的强度计算
   */
  function useStrength(password: string) {
    const score = useMemo(() => calcStrength(password), [password])
    const pct = useMemo(() => strengthPct(score), [score])
    const level = useMemo(() => strengthLevel(score), [score])
    const text = useMemo(() => strengthText(score), [score])

    return { score, pct, level, text }
  }

  return {
    PASSWORD_MIN_LENGTH,
    calcStrength,
    strengthPct,
    strengthLevel,
    strengthText,
    validatePassword,
    validateConfirm,
    useStrength,
  }
}
