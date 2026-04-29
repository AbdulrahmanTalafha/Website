'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/types'
import { localeNames } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  locale: Locale
  scrolled?: boolean
}

export default function LanguageSwitcher({ locale, scrolled = true }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar'
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <Link
      href={otherPath}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
        scrolled
          ? 'border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-400'
          : 'border-white/30 text-white hover:bg-white/10'
      )}
      title={localeNames[otherLocale]}
      aria-label={`Switch to ${localeNames[otherLocale]}`}
      hrefLang={otherLocale}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{localeNames[otherLocale]}</span>
    </Link>
  )
}
