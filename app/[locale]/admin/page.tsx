'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, ShieldCheck, Users, UserPlus, Image as ImageIcon, AlertTriangle, TrendingUp, PieChart, BarChart3, Layout, List, ArrowRight, AlertCircle } from 'lucide-react'
import {
  Chart,
  LineController, LineElement, PointElement,
  LinearScale, CategoryScale,
  DoughnutController, ArcElement,
  Tooltip, Legend, Filler,
} from 'chart.js'
import styles from './page.module.css'

Chart.register(
  LineController, LineElement, PointElement,
  LinearScale, CategoryScale,
  DoughnutController, ArcElement,
  Tooltip, Legend, Filler
)

// definePageMeta({ auth: true }) — handled by proxy

const engineColors: string[] = ['#6366F1', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#14B8A6']

export default function AdminDashboardPage() {
  const t = useTranslations('admin')
  const tc = useTranslations('common')
  const router = useRouter()
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  const lineChartRef = useRef<HTMLCanvasElement | null>(null)
  const donutChartRef = useRef<HTMLCanvasElement | null>(null)
  const lineChartInstance = useRef<Chart | null>(null)
  const donutChartInstance = useRef<Chart | null>(null)

  const periodOptions = useMemo(() => [
    { label: t('period7d'), value: 7 },
    { label: t('period30d'), value: 30 },
    { label: t('period90d'), value: 90 },
  ], [t])

  const errorRatePct = useMemo(() => {
    if (!stats) return '0.0'
    const { successCount, errorCount } = stats.overview
    const total = successCount + errorCount
    if (total === 0) return '0.0'
    return ((errorCount / total) * 100).toFixed(1)
  }, [stats])

  const errorRateHigh = Number(errorRatePct) > 5

  const maxEventCount = useMemo(() => {
    if (!stats?.eventCounts?.length) return 1
    return Math.max(1, ...stats.eventCounts.map((e: any) => Number(e.count)))
  }, [stats])

  const maxPageCount = useMemo(() => {
    if (!stats?.topPages?.length) return 1
    return Math.max(1, ...stats.topPages.map((p: any) => Number(p.count)))
  }, [stats])

  async function fetchStats() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetch(`/api/admin/stats?days=${days}`).then(r => r.json())
      setStats(data)
    } catch (e: any) {
      if (e?.statusCode === 403 || e?.statusCode === 401) {
        setError(t('unauthorized'))
        setTimeout(() => router.push('/'), 2000)
        return
      }
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }

  function renderCharts() {
    if (!stats) return

    if (lineChartRef.current) {
      lineChartInstance.current?.destroy()
      const dailyData = stats.dailyProcessing || []
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: dailyData.map((d: any) => {
            const date = new Date(d.date)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }),
          datasets: [{
            label: t('chartProcessing'),
            data: dailyData.map((d: any) => Number(d.count)),
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5, borderWidth: 2,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1C1917', titleColor: '#F5F4F2', bodyColor: '#A8A29E', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, cornerRadius: 8, padding: 10 },
          },
          scales: {
            x: { grid: { color: 'rgba(28,25,23,0.05)' }, ticks: { color: '#A8A29E', font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: 'rgba(28,25,23,0.05)' }, ticks: { color: '#A8A29E', font: { size: 11 }, precision: 0 } },
          },
        },
      })
    }

    if (donutChartRef.current) {
      donutChartInstance.current?.destroy()
      const engineData = stats.engineUsage || []
      donutChartInstance.current = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: engineData.map((e: any) => e.engine || t('unknown')),
          datasets: [{
            data: engineData.map((e: any) => Number(e.count)),
            backgroundColor: engineColors.slice(0, engineData.length),
            borderWidth: 0, hoverOffset: 6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1C1917', titleColor: '#F5F4F2', bodyColor: '#A8A29E', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, cornerRadius: 8, padding: 10 },
          },
        },
      })
    }
  }

  useEffect(() => { fetchStats() }, [days])

  useEffect(() => {
    if (stats) requestAnimationFrame(() => renderCharts())
  }, [stats])

  useEffect(() => {
    return () => {
      lineChartInstance.current?.destroy()
      donutChartInstance.current?.destroy()
    }
  }, [])

  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderLeft}>
          <Link href="/" className={styles.adminBack}>
            <ArrowLeft size={14} />
            {tc('backToHome')}
          </Link>
          <h1 className={styles.adminTitle}>
            <ShieldCheck size={20} className={styles.adminTitleIcon} />
            {t('title')}
          </h1>
        </div>
        <div className={styles.adminPeriod}>
          {periodOptions.map(d => (
            <button key={d.value} className={`${styles.periodBtn} ${days === d.value ? styles.periodBtnActive : ''}`} onClick={() => setDays(d.value)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.adminLoading}>
          <div className={styles.adminSpinner} />
          <span>{t('loading')}</span>
        </div>
      ) : error ? (
        <div className={styles.adminError}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="btn btn-secondary btn-sm" onClick={fetchStats}>{tc('retry')}</button>
        </div>
      ) : stats ? (
        <div>
          {/* Stat cards */}
          <div className={styles.statCards}>
            <div className={styles.statCard}>
              <div className={`${styles.scIcon} ${styles.scIconBlue}`}><Users size={18} /></div>
              <div className={styles.scBody}>
                <span className={styles.scValue}>{stats.overview.totalUsers.toLocaleString()}</span>
                <span className={styles.scLabel}>{t('totalUsers')}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.scIcon} ${styles.scIconGreen}`}><UserPlus size={18} /></div>
              <div className={styles.scBody}>
                <span className={styles.scValue}>{stats.overview.newUsers.toLocaleString()}</span>
                <span className={styles.scLabel}>{t('newUsers', { days })}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.scIcon} ${styles.scIconIndigo}`}><ImageIcon size={18} /></div>
              <div className={styles.scBody}>
                <span className={styles.scValue}>{stats.overview.successCount.toLocaleString()}</span>
                <span className={styles.scLabel}>{t('processCount')}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.scIcon} ${errorRateHigh ? styles.scIconRed : styles.scIconGreen}`}><AlertTriangle size={18} /></div>
              <div className={styles.scBody}>
                <span className={styles.scValue}>{errorRatePct}%</span>
                <span className={styles.scLabel}>{t('errorRate')}</span>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <div className={styles.ccHeader}>
                <TrendingUp size={14} className={styles.ccHeaderIcon} />
                <span className={styles.ccTitle}>{t('dailyTrend')}</span>
              </div>
              <div className={styles.ccCanvasWrap}><canvas ref={lineChartRef} /></div>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.ccHeader}>
                <PieChart size={14} className={styles.ccHeaderIcon} />
                <span className={styles.ccTitle}>{t('engineDistribution')}</span>
              </div>
              <div className={`${styles.ccCanvasWrap} ${styles.ccCanvasWrapDonut}`}><canvas ref={donutChartRef} /></div>
              <div className={styles.engineLegend}>
                {(stats.engineUsage || []).map((item: any, i: number) => (
                  <div key={item.engine} className={styles.elItem}>
                    <span className={styles.elDot} style={{ background: engineColors[i] || '#999' }} />
                    <span className={styles.elName}>{item.engine || t('unknown')}</span>
                    <span className={styles.elCount}>{Number(item.count).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className={styles.bottomRow}>
            <div className={styles.chartCard}>
              <div className={styles.ccHeader}>
                <BarChart3 size={14} className={styles.ccHeaderIcon} />
                <span className={styles.ccTitle}>{t('eventRanking')}</span>
              </div>
              <div className={styles.eventList}>
                {(stats.eventCounts || []).map((item: any) => (
                  <div key={item.event} className={styles.evItem}>
                    <span className={styles.evName}>{item.event}</span>
                    <div className={styles.evBarWrap}>
                      <div className={styles.evBar} style={{ width: (Number(item.count) / maxEventCount * 100) + '%' }} />
                    </div>
                    <span className={styles.evCount}>{Number(item.count).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.ccHeader}>
                <Layout size={14} className={styles.ccHeaderIcon} />
                <span className={styles.ccTitle}>{t('pageRanking')}</span>
              </div>
              <div className={styles.eventList}>
                {(stats.topPages || []).map((item: any) => (
                  <div key={item.page} className={styles.evItem}>
                    <span className={styles.evName}>{item.page || '/'}</span>
                    <div className={styles.evBarWrap}>
                      <div className={`${styles.evBar} ${styles.evBarOrange}`} style={{ width: (Number(item.count) / maxPageCount * 100) + '%' }} />
                    </div>
                    <span className={styles.evCount}>{Number(item.count).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/admin/events" className={styles.adminEventsLink}>
            <List size={14} />
            {t('viewEventDetail')}
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
