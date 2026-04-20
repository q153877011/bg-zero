/**
 * lib/legal/dataRetention.ts
 * Data retention periods — centralized constants for compliance.
 */

export const DATA_RETENTION = {
  /** Account data: retained while account is active */
  ACCOUNT: 'account_lifetime',

  /** Session cookies: 7 days */
  SESSION_DAYS: 7,

  /** Email verification tokens: 24 hours */
  VERIFICATION_TOKEN_HOURS: 24,

  /** Password reset tokens: 1 hour */
  RESET_TOKEN_HOURS: 1,

  /** Analytics events: 12 months */
  ANALYTICS_MONTHS: 12,

  /** Server access logs (IP, etc.): 30 days */
  LOGS_DAYS: 30,

  /** Resend email logs (third-party): 30 days */
  EMAIL_LOGS_DAYS: 30,
} as const

/**
 * GDPR response deadline: 30 calendar days
 * Per GDPR Art. 12(3)
 */
export const GDPR_RESPONSE_DAYS = 30

/**
 * Breach notification deadline: 72 hours
 * Per GDPR Art. 33
 */
export const BREACH_NOTIFICATION_HOURS = 72
