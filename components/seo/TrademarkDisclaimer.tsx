/**
 * components/seo/TrademarkDisclaimer.tsx
 * Trademark disclaimer component for comparison pages.
 * Required for nominative fair use compliance.
 */

interface TrademarkDisclaimerProps {
  /** List of third-party trademarks mentioned on the page */
  trademarks: Array<{
    name: string
    owner: string
  }>
}

export default function TrademarkDisclaimer({ trademarks }: TrademarkDisclaimerProps) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <aside
      role="note"
      style={{
        marginTop: '2rem',
        padding: '1rem 1.25rem',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        fontSize: '0.8125rem',
        lineHeight: '1.6',
        color: '#78716C',
      }}
    >
      <strong style={{ color: '#57534E' }}>Trademark Notice:</strong>{' '}
      {trademarks.map((tm, i) => (
        <span key={tm.name}>
          {tm.name} is a trademark of {tm.owner}
          {i < trademarks.length - 1 ? '. ' : '. '}
        </span>
      ))}
      BG-Zero is not affiliated with, endorsed by, or sponsored by{' '}
      {trademarks.length === 1
        ? 'this company'
        : 'these companies'}
      . All comparisons are based on publicly available information as of {today}.
    </aside>
  )
}
