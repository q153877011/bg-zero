'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { FileText } from 'lucide-react'
import styles from './page.module.css'

const articles = [
  {
    key: 'howToRemoveBg' as const,
    href: '/blog/how-to-remove-background',
  },
  {
    key: 'idPhotoChange' as const,
    href: '/blog/id-photo-background-change',
  },
  {
    key: 'ecommercePhoto' as const,
    href: '/blog/ecommerce-product-photo',
  },
  {
    key: 'videoRemoval' as const,
    href: '/blog/video-background-removal',
  },
]

export default function BlogPage() {
  const t = useTranslations('blog')

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <h1 className={styles.h1}>{t('listTitle')}</h1>
          <p className={styles.heroSub}>{t('listSub')}</p>
        </header>

        <div className={styles.grid}>
          {articles.map(({ key, href }) => (
            <Link key={key} href={href} className={styles.card}>
              <FileText size={16} className={styles.cardIcon} />
              <p className={styles.cardTitle}>{t(`${key}.title`)}</p>
              <p className={styles.cardSummary}>{t(`${key}.summary`)}</p>
              <p className={styles.cardDate}>{t(`${key}.date`)}</p>
              <p className={styles.cardArrow}>{t('readMore')} →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
