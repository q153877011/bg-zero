'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ChevronDown, LogOut } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import styles from './UserMenu.module.css'

export default function UserMenu() {
  const t = useTranslations('common')
  const { data: session } = useSession()
  const user = session?.user
  const loggedIn = !!user

  const [showMenu, setShowMenu] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState(false)

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowMenu(false)
  }, [])

  useEffect(() => {
    if (showMenu) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [showMenu, handleKeydown])

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    setSignOutError(false)
    setShowMenu(false)
    try {
      await signOut()
    } catch {
      setSignOutError(true)
      setShowMenu(true)
      setTimeout(() => setSignOutError(false), 3000)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loggedIn) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[rgba(28,25,23,0.05)] transition-colors"
          onClick={() => setShowMenu(!showMenu)}
          disabled={isSigningOut}
        >
          {user?.image && user.image.startsWith('https://') ? (
            <Image
              src={user.image}
              alt={user?.name || 'User'}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover bg-[var(--bg-secondary)]"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold select-none">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <span className="text-[13px] font-medium text-[var(--text-primary)] max-w-[100px] truncate hidden sm:block">
            {user?.name}
          </span>
          <ChevronDown size={12} className="text-[var(--text-tertiary)]" />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div
              className={`absolute right-0 mt-1.5 w-48 bg-[var(--bg-canvas)] border border-[rgba(28,25,23,0.08)] rounded-xl shadow-lg py-1.5 z-50 ${styles.dropdown}`}
            >
              <div className="px-3 py-2 border-b border-[rgba(28,25,23,0.06)] mb-1">
                <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                  {user?.email}
                </p>
              </div>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] text-[var(--text-secondary)] hover:bg-[rgba(28,25,23,0.04)] transition-colors"
                disabled={isSigningOut}
                onClick={handleSignOut}
              >
                <LogOut size={13} />
                {isSigningOut ? t('signingOut') : t('signOut')}
              </button>
              {signOutError && (
                <p className="px-3 py-1.5 text-[11px] text-red-500">{t('signOutFailed')}</p>
              )}
            </div>
            {/* Click outside to close */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          </>
        )}
      </div>
    )
  }

  return (
    <Link href="/login" className={styles['signin-btn']} aria-label={t('loginLabel')}>
      <span className={styles['signin-fill']} aria-hidden="true" />
      <span className={styles['signin-label']}>{t('signIn')}</span>
      <span className={styles['signin-arrow']} aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8M7 3l3 3-3 3"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  )
}
