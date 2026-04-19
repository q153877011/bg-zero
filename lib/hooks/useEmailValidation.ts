const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 统一邮箱校验，供 login / register / forgot-password 共用 */
export function useEmailValidation() {
  function validateEmail(email: string): string {
    if (!email) return 'errEmailRequired'
    if (!EMAIL_REGEX.test(email)) return 'errEmailInvalid'
    return ''
  }

  return { validateEmail }
}
