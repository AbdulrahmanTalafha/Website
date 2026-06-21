'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Loader2, FileText, Folder, Newspaper, Megaphone, Users, Handshake, Layout } from 'lucide-react'
import type { Locale } from '@/types'
import { fetchSiteSearch, type SearchResultGroup } from '@/lib/search'
import { cn } from '@/lib/utils'

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pages: Layout,
  projects: Folder,
  publications: FileText,
  news: Newspaper,
  initiatives: Megaphone,
  partners: Handshake,
  team_members: Users,
}

interface Props {
  locale: Locale
  variant?: 'panel' | 'page'
  /** Controlled query (header panel). */
  query?: string
  /** Initial query for full search page (from URL). */
  initialQuery?: string
  onNavigate?: () => void
}

export default function SiteSearchResults({
  locale,
  variant = 'page',
  query: controlledQuery,
  initialQuery = '',
  onNavigate,
}: Props) {
  const isRTL = locale === 'ar'
  const [internalQuery, setInternalQuery] = useState(initialQuery)
  const query = controlledQuery ?? internalQuery
  const [groups, setGroups] = useState<SearchResultGroup[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length < 2) {
      setGroups([])
      setTotal(0)
      setSearched(trimmed.length > 0)
      setLoading(false)
      return
    }

    setLoading(true)
    const limit = variant === 'panel' ? 5 : 12
    const data = await fetchSiteSearch(locale, trimmed, limit)
    setGroups(data?.groups ?? [])
    setTotal(data?.total ?? 0)
    setSearched(true)
    setLoading(false)
  }, [locale, variant])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setGroups([])
      setTotal(0)
      setSearched(query.trim().length > 0)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      runSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, runSearch])

  useEffect(() => {
    if (controlledQuery === undefined && initialQuery) {
      setInternalQuery(initialQuery)
    }
  }, [initialQuery, controlledQuery])

  const showInput = variant === 'page' && controlledQuery === undefined

  return (
    <div className={variant === 'panel' ? 'w-full' : ''}>
      {showInput && (
        <div className="relative mb-6">
          <Search className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400', isRTL ? 'right-4' : 'left-4')} />
          <input
            type="search"
            value={internalQuery}
            onChange={(e) => setInternalQuery(e.target.value)}
            placeholder={isRTL ? 'ابحث في الموقع...' : 'Search the site...'}
            className={cn(
              'w-full bg-white text-neutral-800 rounded-xl py-4 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-200',
              isRTL ? 'pe-5 ps-12' : 'ps-12 pe-5',
            )}
            autoComplete="off"
            autoFocus
          />
          {loading && (
            <Loader2 className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary-400', isRTL ? 'left-4' : 'right-4')} />
          )}
        </div>
      )}

      {variant === 'panel' && loading && (
        <div className="flex items-center gap-2 text-sm text-neutral-500 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {isRTL ? 'جارٍ البحث...' : 'Searching...'}
        </div>
      )}

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="text-sm text-neutral-500 py-2">
          {isRTL ? 'يرجى إدخال حرفين على الأقل' : 'Enter at least 2 characters'}
        </p>
      )}

      {searched && !loading && total === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-neutral-500 py-4 text-center">
          {isRTL ? `لا نتائج لـ "${query}"` : `No results for "${query}"`}
        </p>
      )}

      {total > 0 && !loading && variant === 'page' && (
        <p className="text-sm text-neutral-500 mb-6">
          {isRTL ? `${total} نتيجة لـ "${query}"` : `${total} results for "${query}"`}
        </p>
      )}

      <div className={cn('space-y-6', variant === 'panel' && 'max-h-[60vh] overflow-y-auto')}>
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.type] ?? FileText
          return (
            <div key={group.type}>
              <h3 className="flex items-center gap-2 text-sm font-black text-primary-600 mb-2">
                <Icon className="w-4 h-4 shrink-0" />
                {group.label}
                <span className="text-neutral-400 font-normal">({group.items.length})</span>
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-start gap-3 rounded-xl transition-colors',
                        variant === 'panel'
                          ? 'px-3 py-2.5 hover:bg-neutral-50'
                          : 'bg-white border border-transparent hover:border-primary-100 hover:shadow-sm p-4',
                      )}
                    >
                      {item.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          <Image src={item.image} alt="" fill className="object-cover" sizes="40px" unoptimized />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-neutral-800 truncate">{item.title}</span>
                        {item.excerpt && (
                          <span className="block text-xs text-neutral-500 line-clamp-2 mt-0.5">{item.excerpt}</span>
                        )}
                        {item.date && variant === 'page' && (
                          <span className="block text-xs text-neutral-400 mt-1">{item.date}</span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {variant === 'panel' && query.trim().length >= 2 && total > 0 && (
        <Link
          href={`/${locale}/search?q=${encodeURIComponent(query.trim())}`}
          onClick={onNavigate}
          className="mt-4 block text-center text-sm font-bold text-primary-500 hover:text-secondary-500"
        >
          {isRTL ? 'عرض كل النتائج' : 'View all results'}
        </Link>
      )}
    </div>
  )
}
