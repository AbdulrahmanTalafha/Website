'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/types'
import type { ResolvedNavItem } from '@/lib/mapNavigation'
import { navItemUrl } from '@/lib/mapNavigation'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface MobileNavProps {
  locale: Locale
  isOpen: boolean
  onClose: () => void
  navItems: ResolvedNavItem[]
}

export default function MobileNav({ locale, isOpen, onClose, navItems }: MobileNavProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-primary-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          'fixed top-0 z-50 h-full w-80 max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 lg:hidden flex flex-col',
          locale === 'ar' ? 'right-0' : 'left-0',
          isOpen
            ? 'translate-x-0'
            : locale === 'ar' ? 'translate-x-full' : '-translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <Link
            href={`/${locale}`}
            onClick={onClose}
            className="font-bold text-primary-500 text-lg"
          >
            {locale === 'ar' ? 'مركز We Rise' : 'We Rise Center'}
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-primary-500 transition-colors rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => (
            <div key={`${item.href}-${item.label}`}>
              {item.children && item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-primary-600 font-medium hover:bg-neutral-50 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-neutral-400 transition-transform',
                        expanded === item.href && 'rotate-180'
                      )}
                    />
                  </button>
                  {expanded === item.href && (
                    <div className="ms-4 border-s-2 border-primary-100 ps-3 py-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={`${child.href}-${child.label}`}
                          href={navItemUrl(locale, child.href)}
                          onClick={onClose}
                          className="block px-3 py-2 rounded-lg text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={navItemUrl(locale, item.href)}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg font-medium transition-colors',
                    pathname === navItemUrl(locale, item.href)
                      ? 'text-secondary-500 bg-secondary-50'
                      : 'text-primary-600 hover:text-secondary-500 hover:bg-neutral-50'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-neutral-100 px-5 py-4">
          <Link
            href={`/${locale === 'ar' ? 'en' : 'ar'}${pathname.replace(`/${locale}`, '')}`}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            {locale === 'ar' ? 'English' : 'العربية'}
          </Link>
        </div>
      </div>
    </>
  )
}
