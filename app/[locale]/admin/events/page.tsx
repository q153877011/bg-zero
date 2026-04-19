'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { ArrowLeft, List, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './page.module.css'

// definePageMeta({ auth: true }) — handled by proxy

const eventTypes = [
  'page_view', 'image_upload', 'engine_switch',
  'process_start', 'process_done', 'process_error',
  'download', 'manual_remove', 'manual_mask',
  'sign_up', 'sign_in',
]

function formatTime(iso: string): string {
  const d = new Date(iso)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${m}-${day} ${h}:${min}`
}

function eventColor(event: string): string {
  const colors: Record<string, string> = {
    process_done: 'Green', process_error: 'Red', page_view: 'Gray',
    image_upload: 'Blue', download: 'Indigo', engine_switch: 'Orange',
    sign_in: 'Purple', sign_up: 'Purple', manual_remove: 'Orange',
    manual_mask: 'Green', process_start: 'Blue',
  }
  return colors[event] || 'Gray'
}

export default function AdminEventsPage() {
  const t = useTranslations('admin')
  const tc = useTranslations('common')
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [eventFilter, setEventFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  function formatMeta(event: string, meta: any): string {
    if (!meta || typeof meta !== 'object') return ''
    try {
      const m = typeof meta === 'string' ? JSON.parse(meta) : meta
      switch (event) {
        case 'process_done': return `${m.engine || '?'} · ${m.duration_ms ? (m.duration_ms / 1000).toFixed(1) + 's' : ''}`
        case 'process_error': return `${m.engine || '?'} · ${m.error || ''}`
        case 'image_upload': return `${m.size_kb || '?'}KB · ${m.format || '?'}`
        case 'page_view': return m.page || ''
        case 'download': return `${m.page || '?'} · ${m.format || 'png'}`
        case 'engine_switch': return `${m.from || '?'} → ${m.to || '?'}`
        case 'manual_remove': return `${t('tolerance')} ${m.tolerance ?? '?'}`
        case 'sign_in': case 'sign_up': return m.provider || ''
        default: return JSON.stringify(m).slice(0, 80)
      }
    } catch { return String(meta).slice(0, 80) }
  }

  async function fetchEvents() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' })
      if (eventFilter) params.set('event', eventFilter)
      const result = await fetch(`/api/admin/events?${params}`).then(r => r.json())
      setData(result)
    } catch (e: any) {
      if (e?.statusCode === 403 || e?.statusCode === 401) {
        setError(t('unauthorized'))
        setTimeout(() => router.push('/'), 2000)
        return
      }
      setError(t('eventsLoadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [page, eventFilter])

  return (
    <div className={styles.eventsPage}>
      {/* Header */}
      <div className={styles.eventsHeader}>
        <div className={styles.eventsHeaderLeft}>
          <Link href="/admin" className={styles.eventsBack}>
            <ArrowLeft size={14} />
            {t('title')}
          </Link>
          <h1 className={styles.eventsTitle}>
            <List size={18} className={styles.eventsTitleIcon} />
            {t('eventsTitle')}
          </h1>
        </div>
        <div>
          <select
            value={eventFilter}
            onChange={e => { setEventFilter(e.target.value); setPage(1) }}
            className={styles.filterSelect}
          >
            <option value="">{t('allEvents')}</option>
            {eventTypes.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.eventsLoading}>
          <div className={styles.eventsSpinner} />
          <span>{t('eventsLoading')}</span>
        </div>
      ) : error ? (
        <div className={styles.eventsError}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="btn btn-secondary btn-sm" onClick={fetchEvents}>{tc('retry')}</button>
        </div>
      ) : (
        <div>
          <div className={styles.eventsTableWrap}>
            <table className={styles.eventsTable}>
              <thead>
                <tr>
                  <th>{t('thTime')}</th>
                  <th>{t('thUser')}</th>
                  <th>{t('thEvent')}</th>
                  <th>{t('thDetails')}</th>
                </tr>
              </thead>
              <tbody>
                {data?.events?.map((ev: any) => (
                  <tr key={ev.id}>
                    <td className={styles.tdTime}>{formatTime(ev.created_at)}</td>
                    <td className={styles.tdUser}>
                      {ev.user_name ? (
                        <span className={styles.userName}>{ev.user_name}</span>
                      ) : (
                        <span className={styles.userGuest}>{t('guest')}</span>
                      )}
                      {ev.user_email && <span className={styles.userEmail}>{ev.user_email}</span>}
                    </td>
                    <td>
                      <span className={`${styles.eventBadge} ${styles[`eb${eventColor(ev.event)}`]}`}>
                        {ev.event}
                      </span>
                    </td>
                    <td className={styles.tdMeta}>
                      <span className={styles.metaText}>{formatMeta(ev.event, ev.metadata)}</span>
                    </td>
                  </tr>
                ))}
                {(!data?.events?.length) && (
                  <tr>
                    <td colSpan={4} className={styles.tdEmpty}>{t('noEvents')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pgBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={14} />
              </button>
              <span className={styles.pgInfo}>
                {t('pagination', { page: data.pagination.page, totalPages: data.pagination.totalPages })}
                <span className={styles.pgTotal}>{t('items', { total: data.pagination.total })}</span>
              </span>
              <button className={styles.pgBtn} disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
