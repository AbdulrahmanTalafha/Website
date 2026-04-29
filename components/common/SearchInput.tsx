'use client'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  locale: Locale
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
}

export default function SearchInput({
  locale,
  placeholder,
  className,
  size = 'md',
  variant = 'default',
}: SearchInputProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const defaultPlaceholder = locale === 'ar'
    ? 'ابحث في المشاريع، التقارير، الأخبار...'
    : 'Search projects, reports, news...'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <Search className={cn(
          'absolute pointer-events-none text-neutral-400',
          locale === 'ar' ? 'right-3' : 'left-3',
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
        )} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? defaultPlaceholder}
          className={cn(
            'w-full border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-300',
            locale === 'ar' ? 'pr-10 pl-10' : 'pl-10 pr-10',
            size === 'sm' ? 'py-2 text-sm' : size === 'lg' ? 'py-4 text-base' : 'py-2.5 text-sm',
            variant === 'white'
              ? 'bg-white border-neutral-200 text-primary-500 placeholder:text-neutral-400'
              : 'bg-neutral-50 border-neutral-200 text-primary-500 placeholder:text-neutral-400 focus:bg-white'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className={cn(
              'absolute text-neutral-400 hover:text-primary-500',
              locale === 'ar' ? 'left-3' : 'right-3'
            )}
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}
