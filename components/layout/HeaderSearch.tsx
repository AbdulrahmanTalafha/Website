'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Locale } from '@/types'
import SiteSearchResults from '@/components/search/SiteSearchResults'
import { cn } from '@/lib/utils'

interface Props {
  locale: Locale
}

export default function HeaderSearch({ locale }: Props) {
  const isRTL = locale === 'ar'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
    setQuery('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isRTL ? 'بحث' : 'Search'}
        className="p-2 rounded-full text-neutral-500 hover:text-primary-500 hover:bg-primary-50 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label={isRTL ? 'إغلاق' : 'Close'}
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-white shadow-2xl border-b border-neutral-100"
          >
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400', isRTL ? 'right-3' : 'left-3')} />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isRTL ? 'ابحث في الموقع...' : 'Search the site...'}
                    className={cn(
                      'w-full rounded-xl border border-neutral-200 py-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-200',
                      isRTL ? 'pe-4 ps-11' : 'ps-11 pe-4',
                    )}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
                  aria-label={isRTL ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SiteSearchResults
                locale={locale}
                variant="panel"
                query={query}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
