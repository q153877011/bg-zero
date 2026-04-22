import { ImageResponse } from 'next/og'

// Next.js built-in OG image generator
// Renders at https://www.bg-zero.online/og.png
// Deliberately uses system fonts so no external dependencies are needed.
export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }
export const alt = 'BG-Zero — Remove image backgrounds in your browser'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          background:
            'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 50%, #EEF2FF 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: 240,
            background:
              'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.15) 50%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Decorative glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: 210,
            background:
              'radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo diamond */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            ◆
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1C1917',
              letterSpacing: -0.5,
            }}
          >
            BG-Zero
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.02,
            color: '#1C1917',
            letterSpacing: -2.5,
            marginBottom: 28,
            maxWidth: 960,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Remove backgrounds</span>
          <span
            style={{
              background:
                'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #F97316 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            instantly. Locally.
          </span>
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: '#57534E',
            letterSpacing: -0.3,
            marginBottom: 48,
          }}
        >
          AI-powered · Runs in your browser · Free &amp; open source
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          {[
            'No upload',
            'No watermark',
            'No signup',
            '3 AI engines',
          ].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '12px 22px',
                borderRadius: 999,
                background: 'rgba(28,25,23,0.06)',
                border: '1px solid rgba(28,25,23,0.08)',
                color: '#44403C',
                fontSize: 22,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ color: '#10B981' }}>✓</span>
              {tag}
            </div>
          ))}
        </div>

        {/* Domain mark bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            right: 96,
            fontSize: 22,
            fontWeight: 600,
            color: '#A8A29E',
            letterSpacing: 0.5,
          }}
        >
          www.bg-zero.online
        </div>
      </div>
    ),
    { ...size }
  )
}
