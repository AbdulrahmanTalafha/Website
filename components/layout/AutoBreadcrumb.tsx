'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BASE_URL } from '@/lib/seo'

const ROUTE_LABELS: Record<string, { ar: string; en: string }> = {
  'programs-projects':     { ar: 'البرامج والمشاريع',       en: 'Programs & Projects' },
  'initiatives-campaigns': { ar: 'المبادرات والحملات',      en: 'Initiatives & Campaigns' },
  'publications-reports':  { ar: 'المنشورات والتقارير',     en: 'Publications & Reports' },
  'media-center':          { ar: 'المركز الإعلامي',         en: 'Media Center' },
  'about':                 { ar: 'من نحن',                  en: 'About Us' },
  'team-governance':       { ar: 'الفريق والحوكمة',         en: 'Team & Governance' },
  'partners-supporters':   { ar: 'الشركاء والداعمون',       en: 'Partners & Supporters' },
  'contact':               { ar: 'اتصل بنا',                en: 'Contact Us' },
  'digital-observatory':   { ar: 'المرصد الرقمي',           en: 'Digital Observatory' },
  'e-election-platform':   { ar: 'منصة الانتخابات',         en: 'E-Election Platform' },
  'search':                { ar: 'البحث',                   en: 'Search' },
  'join-us':               { ar: 'انضم إلينا',              en: 'Join Us' },
}

export default function AutoBreadcrumb() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    const raw = document.title || ''
    setPageTitle(raw.split('|')[0].trim())
  }, [pathname])

  if (!pathname) return null

  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0] as 'ar' | 'en'
  const pathSegments = segments.slice(1)

  if (pathSegments.length === 0) return null

  const isRTL = locale === 'ar'
  const Chevron = isRTL ? ChevronLeft : ChevronRight
  const isDarkPage = pathSegments[0] === 'digital-observatory'

  const items: { label: string; href: string; current: boolean }[] = []
  pathSegments.forEach((seg, i) => {
    const href = '/' + segments.slice(0, i + 2).join('/')
    const isCurrent = i === pathSegments.length - 1
    const routeLabel = ROUTE_LABELS[seg]
    const label = routeLabel
      ? (isRTL ? routeLabel.ar : routeLabel.en)
      : (isCurrent && pageTitle ? pageTitle : seg.replace(/-/g, ' '))
    items.push({ label, href, current: isCurrent })
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRTL ? 'الرئيسية' : 'Home', item: `${BASE_URL}/${locale}` },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        item: `${BASE_URL}${item.href}`,
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label={isRTL ? 'مسار التنقل' : 'Breadcrumb'}
        className={`relative z-[2] border-b ${
          isDarkPage
            ? 'bg-primary-900/80 border-white/10 backdrop-blur-sm'
            : 'bg-white border-neutral-100'
        }`}
      >
        <ol
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-10 text-xs overflow-hidden"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li className="flex items-center shrink-0" itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
            <Link
              href={`/${locale}`}
              className={`flex items-center transition-colors ${
                isDarkPage
                  ? 'text-white/50 hover:text-white'
                  : 'text-neutral-400 hover:text-primary-500'
              }`}
              aria-label={isRTL ? 'الرئيسية' : 'Home'}
              itemProp="item"
            >
              <Home className="w-3.5 h-3.5" />
              <meta itemProp="name" content={isRTL ? 'الرئيسية' : 'Home'} />
              <meta itemProp="position" content="1" />
            </Link>
          </li>

          {items.map((item, i) => (
            <li
              key={item.href}
              className="flex items-center gap-1 shrink-0 min-w-0"
              itemScope
              itemType="https://schema.org/ListItem"
              itemProp="itemListElement"
            >
              <Chevron className={`w-3 h-3 shrink-0 ${isDarkPage ? 'text-white/30' : 'text-neutral-300'}`} aria-hidden="true" />
              {item.current ? (
                <span
                  className={`font-semibold truncate max-w-[200px] ${
                    isDarkPage ? 'text-secondary-400' : 'text-primary-500'
                  }`}
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors truncate max-w-[160px] ${
                    isDarkPage
                      ? 'text-white/60 hover:text-white'
                      : 'text-neutral-500 hover:text-primary-500'
                  }`}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(i + 2)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
