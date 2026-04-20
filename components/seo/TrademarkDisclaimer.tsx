/**
 * components/seo/TrademarkDisclaimer.tsx
 * Trademark disclaimer component for comparison pages.
 * Required for nominative fair use compliance.
 */
import styles from './TrademarkDisclaimer.module.css'

interface TrademarkDisclaimerProps {
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
    <aside role="note" className={styles.disclaimer}>
      <strong className={styles.label}>Trademark Notice:</strong>{' '}
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
