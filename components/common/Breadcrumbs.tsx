import Link from 'next/link'
import { ChevronRight, ChevronLeft, Home } from 'lucide-react'
import type { Locale } from '@/types'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  locale: Locale
  light?: boolean
}

export default function Breadcrumbs({ items, locale, light = false }: BreadcrumbsProps) {
  const isRTL = locale === 'ar'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm flex-wrap">
      <Link
        href={`/${locale}`}
        className={`flex items-center hover:text-secondary-500 transition-colors ${light ? 'text-white/70' : 'text-neutral-400'}`}
        aria-label={locale === 'ar' ? 'الرئيسية' : 'Home'}
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronIcon className={`w-3 h-3 ${light ? 'text-white/40' : 'text-neutral-300'}`} />
          {item.href ? (
            <Link
              href={item.href}
              className={`hover:text-secondary-500 transition-colors ${light ? 'text-white/70' : 'text-neutral-500'}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${light ? 'text-white' : 'text-primary-500'}`} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
