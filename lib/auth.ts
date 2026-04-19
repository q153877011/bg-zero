import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { Resend } from 'resend'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
      const safeName = escapeHtml(user.name || '你好')
      const safeUrl = escapeHtml(url)
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: '重置你的 BG-Zero 密码',
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
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#f5f4f2;letter-spacing:-0.02em;">重置你的密码</h1>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#9a99a0;line-height:1.6;">Hi ${safeName},<br>点击下方按钮重置你的 BG Zero 账号密码。</p>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.01em;">重置密码</a>
                  </td></tr>
                  <tr><td align="center">
                    <p style="margin:0;font-size:12px;color:#5a5960;line-height:1.6;">此链接 1 小时后失效。如果你没有请求重置密码，请忽略此邮件。</p>
                  </td></tr>
                </table>
                <p style="margin-top:24px;font-size:11px;color:#3a3940;">&copy; ${new Date().getFullYear()} BG Zero &middot; 本地优先的 AI 抠图工具</p>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      })
      if (error) {
        console.error('[Auth] 重置密码邮件发送失败:', JSON.stringify(error))
        throw new Error('邮件发送失败，请稍后重试')
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const safeName = escapeHtml(user.name || '你好')
      const safeUrl = escapeHtml(url)
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: '验证你的 BG-Zero 邮箱',
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
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#f5f4f2;letter-spacing:-0.02em;">验证你的邮箱</h1>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#9a99a0;line-height:1.6;">Hi ${safeName},<br>感谢注册 BG Zero！点击下方按钮验证你的邮箱地址。</p>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:28px;">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.01em;">验证邮箱</a>
                  </td></tr>
                  <tr><td align="center">
                    <p style="margin:0;font-size:12px;color:#5a5960;line-height:1.6;">此链接 24 小时后失效。如果你没有注册 BG Zero，请忽略此邮件。</p>
                  </td></tr>
                </table>
                <p style="margin-top:24px;font-size:11px;color:#3a3940;">&copy; ${new Date().getFullYear()} BG Zero &middot; 本地优先的 AI 抠图工具</p>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      })
      if (error) {
        console.error('[Auth] 验证邮件发送失败:', JSON.stringify(error))
        throw new Error('邮件发送失败，请稍后重试')
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
