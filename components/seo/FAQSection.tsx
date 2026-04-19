'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { FAQ_KEYS } from '@/lib/constants/faq'

export default function FAQSection() {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {FAQ_KEYS.map((key, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={key}
            className="border border-[rgba(28,25,23,0.07)] rounded-xl bg-[var(--bg-canvas)] overflow-hidden transition-colors"
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-[14px] font-medium text-[var(--text-primary)]">
                {t(`${key}.question`)}
              </span>
              <ChevronDown
                size={16}
                className={`text-[var(--text-tertiary)] flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-4 -mt-1">
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {t(`${key}.answer`)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
