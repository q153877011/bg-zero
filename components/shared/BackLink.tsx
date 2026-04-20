'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import styles from './BackLink.module.css'

export default function BackLink() {
  const tl = useTranslations('legal')
  return (
    <Link href="/" className={styles.backLink}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {tl('backToHome')}
    </Link>
  )
}
