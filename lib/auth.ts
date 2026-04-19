import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { Resend } from 'resend'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true, ca: process.env.DB_SSL_CA || undefined }
    : false,
})

const resend = new Resend(process.env.RESEND_KEY)
const fromEmail = process.env.RESEND_FROM || 'noreply@bg-zero.com'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

interface EmailLocaleContent {
  resetSubject: string
  resetHeading: string
  resetGreeting: (name: string) => string
  resetBody: string
  resetBtn: string
  resetExpiry: string
  resetFooter: (year: number) => string
  verifySubject: string
  verifyHeading: string
  verifyGreeting: (name: string) => string
  verifyBody: string
  verifyBtn: string
  verifyExpiry: string
  verifyFooter: (year: number) => string
}

const emailContent: Record<'en' | 'zh', EmailLocaleContent> = {
  en: {
    resetSubject: 'Reset your BG-Zero password',
    resetHeading: 'Reset Your Password',
    resetGreeting: (name: string) => `Hi ${name},`,
    resetBody: 'Click the button below to reset your BG Zero account password.',
    resetBtn: 'Reset Password',
    resetExpiry: 'This link expires in 1 hour. If you did not request a password reset, please ignore this email.',
    resetFooter: (year: number) => `© ${year} BG Zero · Local-first AI background removal tool`,
    verifySubject: 'Verify your BG-Zero email',
    verifyHeading: 'Verify Your Email',
    verifyGreeting: (name: string) => `Hi ${name},`,
    verifyBody: 'Thanks for signing up for BG Zero! Click the button below to verify your email address.',
    verifyBtn: 'Verify Email',
    verifyExpiry: 'This link expires in 24 hours. If you did not sign up for BG Zero, please ignore this email.',
    verifyFooter: (year: number) => `© ${year} BG Zero · Local-first AI background removal tool`,
  },
  zh: {
    resetSubject: '重置你的 BG-Zero 密码',
    resetHeading: '重置你的密码',
    resetGreeting: (name: string) => `Hi ${name},`,
    resetBody: '点击下方按钮重置你的 BG Zero 账号密码。',
    resetBtn: '重置密码',
    resetExpiry: '此链接 1 小时后失效。如果你没有请求重置密码，请忽略此邮件。',
    resetFooter: (year: number) => `© ${year} BG Zero · 本地优先的 AI 抠图工具`,
    verifySubject: '验证你的 BG-Zero 邮箱',
    verifyHeading: '验证你的邮箱',
    verifyGreeting: (name: string) => `Hi ${name},`,
    verifyBody: '感谢注册 BG Zero！点击下方按钮验证你的邮箱地址。',
    verifyBtn: '验证邮箱',
    verifyExpiry: '此链接 24 小时后失效。如果你没有注册 BG Zero，请忽略此邮件。',
    verifyFooter: (year: number) => `© ${year} BG Zero · 本地优先的 AI 抠图工具`,
  },
}

function getLocaleFromUrl(url: string): 'en' | 'zh' {
  try {
    const segment = new URL(url).pathname.split('/')[1]
    if (segment === 'zh') return 'zh'
    return 'en'
  } catch { return 'en' }
}

export const auth = betterAuth({
  database: pool,

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const locale = getLocaleFromUrl(url)
      const c = emailContent[locale]
      const safeName = escapeHtml(user.name || (locale === 'zh' ? '你好' : 'there'))
      const safeUrl = escapeHtml(url)
      const year = new Date().getFullYear()
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: c.resetSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#0C0B0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0B0F;padding:40px 20px;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#18171c;border:1px solid #2a2930;border-radius:20px;padding:40px;">
                  <tr><td align="center" style="padding-bottom:28px;">
                    <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(140deg,#6366F1,#8B5CF6);display:inline-flex;align-items:center;justify-content:center;">
                      <span style="color:#fff;font-size:22px;font-weight:700;line-height:1;">&#10022;</span>
                    </div>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#f5f4f2;letter-spacing:-0.02em;">${c.resetHeading}</h1>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#9a99a0;line-height:1.6;">${c.resetGreeting(safeName)}<br>${c.resetBody}</p>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.01em;">${c.resetBtn}</a>
                  </td></tr>
                  <tr><td align="center">
                    <p style="margin:0;font-size:12px;color:#5a5960;line-height:1.6;">${c.resetExpiry}</p>
                  </td></tr>
                </table>
                <p style="margin-top:24px;font-size:11px;color:#3a3940;">${c.resetFooter(year)}</p>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      })
      if (error) {
        console.error('[Auth] Failed to send password reset email:', JSON.stringify(error))
        throw new Error('Failed to send email, please try again later')
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const locale = getLocaleFromUrl(url)
      const c = emailContent[locale]
      const safeName = escapeHtml(user.name || (locale === 'zh' ? '你好' : 'there'))
      const safeUrl = escapeHtml(url)
      const year = new Date().getFullYear()
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: c.verifySubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#0C0B0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0B0F;padding:40px 20px;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#18171c;border:1px solid #2a2930;border-radius:20px;padding:40px;">
                  <tr><td align="center" style="padding-bottom:28px;">
                    <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(140deg,#6366F1,#8B5CF6);display:inline-flex;align-items:center;justify-content:center;">
                      <span style="color:#fff;font-size:22px;font-weight:700;line-height:1;">&#10022;</span>
                    </div>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#f5f4f2;letter-spacing:-0.02em;">${c.verifyHeading}</h1>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#9a99a0;line-height:1.6;">${c.verifyGreeting(safeName)}<br>${c.verifyBody}</p>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.01em;">${c.verifyBtn}</a>
                  </td></tr>
                  <tr><td align="center">
                    <p style="margin:0;font-size:12px;color:#5a5960;line-height:1.6;">${c.verifyExpiry}</p>
                  </td></tr>
                </table>
                <p style="margin-top:24px;font-size:11px;color:#3a3940;">${c.verifyFooter(year)}</p>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      })
      if (error) {
        console.error('[Auth] Failed to send verification email:', JSON.stringify(error))
        throw new Error('Failed to send email, please try again later')
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      allowDifferentEmails: false,
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
})
