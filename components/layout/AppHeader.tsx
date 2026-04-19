'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import { Sparkles, Paintbrush } from 'lucide-react'
import UserMenu from '@/components/auth/UserMenu'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import styles from './AppHeader.module.css'

export default function AppHeader() {
  const t = useTranslations('common')
  const pathname = usePathname()

  const navItems = useMemo(() => [
    {
      to: '/auto',
      label: t('autoRemove'),
      icon: Sparkles,
      color: '#6366F1',
      ring: 'rgba(99, 102, 241, 0.20)',
    },
    {
      to: '/manual',
      label: t('manualRemove'),
      icon: Paintbrush,
      color: '#F97316',
      ring: 'rgba(249, 115, 22, 0.20)',
    },
  ], [t])
  const [isScrolled, setIsScrolled] = useState(false)
  const navWrapRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Record<string, HTMLElement>>({})
  const [pill, setPill] = useState({ left: 0, w: 0, show: false })

  const isActive = useCallback((path: string) => pathname === path, [pathname])
  const activeItem = useMemo(() => navItems.find((i) => isActive(i.to)) ?? null, [navItems, isActive])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Measure pill
  const measurePill = useCallback(() => {
    if (!activeItem || !navWrapRef.current) {
      setPill((prev) => ({ ...prev, show: false }))
      return
    }
    const el = itemRefs.current[activeItem.to]
    if (!el) {
      setPill((prev) => ({ ...prev, show: false }))
      return
    }
    const wr = navWrapRef.current.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setPill({ left: er.left - wr.left, w: er.width, show: true })
  }, [activeItem])

  useEffect(() => {
    measurePill()
  }, [measurePill])

  const storeRef = useCallback((el: HTMLElement | null, path: string) => {
    if (!el) {
      delete itemRefs.current[path]
    } else {
      itemRefs.current[path] = el
    }
  }, [])

  const pillStyle = useMemo(() => {
    return {
      '--pill-left': `${pill.left}px`,
      '--pill-w': `${pill.w}px`,
      '--pill-ring': activeItem?.ring ?? 'rgba(99, 102, 241, 0.18)',
      opacity: pill.show ? 1 : 0,
    } as React.CSSProperties
  }, [pill, activeItem])

  return (
    <header className={`${styles['app-header']} ${isScrolled ? styles['is-scrolled'] : ''}`}>
      <div className={styles['header-inner']}>

        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="BG Zero Home">
          <div className={styles['logo-mark']}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 0.5L17.5 9L9 17.5L0.5 9L9 0.5Z" fill="white" fillOpacity="0.12"/>
              <path d="M9 3L15 9L9 15L3 9L9 3Z" fill="white" fillOpacity="0.30"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" fillOpacity="0.62"/>
              <circle cx="9" cy="9" r="2.5" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className={styles['logo-text']}>
            <span className={styles['logo-bold']}>BG</span>
            <span className={styles['logo-light']}>Zero</span>
          </span>
        </Link>

        {/* Center nav with sliding pill */}
        <nav className={styles['nav-wrap']} ref={navWrapRef} aria-label="Main navigation">
          <div className={styles['nav-pill']} style={pillStyle} aria-hidden="true" />

          {navItems.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`${styles['nav-btn']} ${active ? styles['nav-btn--active'] : ''}`}
                style={active ? { '--item-color': item.color } as React.CSSProperties : undefined}
                ref={(el) => storeRef(el, item.to)}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={12} className={styles['nav-btn-ico']} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right area */}
        <div className={styles['header-tail']}>
          <LanguageSwitcher />
          <span className={styles['tail-divider']} aria-hidden="true" />
          <UserMenu />
        </div>

      </div>
    </header>
  )
}
