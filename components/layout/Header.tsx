'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/types'
import type { ResolvedNavItem } from '@/lib/mapNavigation'
import { navItemUrl } from '@/lib/mapNavigation'
import { siteData } from '@/data/site'
import type { ResolvedSiteSettings } from '@/lib/siteSettings'
import { isExternalAsset } from '@/lib/siteSettings'
import LanguageSwitcher from './LanguageSwitcher'
import MobileNav from './MobileNav'
import { cn } from '@/lib/utils'
import { Search, Menu, X, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowLeft, ArrowRight } from 'lucide-react'

interface HeaderProps {
  locale: Locale
  logoSrc?: string
  logoAlt?: string
  social?: ResolvedSiteSettings['social']
  navItems: ResolvedNavItem[]
}

const defaultSocialLinks = [
  { key: 'facebook', icon: Facebook, href: 'https://facebook.com/werise.jo', label: 'Facebook' },
  { key: 'x', icon: Twitter, href: 'https://twitter.com/werise_jo', label: 'Twitter' },
  { key: 'instagram', icon: Instagram, href: 'https://instagram.com/werise.jo', label: 'Instagram' },
  { key: 'linkedin', icon: Linkedin, href: 'https://linkedin.com/company/werise-jo', label: 'LinkedIn' },
  { key: 'youtube', icon: Youtube, href: 'https://youtube.com/@werise-jo', label: 'YouTube' },
]

export default function Header({ locale, logoSrc, logoAlt, social, navItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const resolvedLogo = logoSrc ?? (locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg')
  const resolvedLogoAlt = logoAlt ?? siteData.name[locale]
  const logoExternal = isExternalAsset(resolvedLogo)

  const socialLinks = social
    ? [
        { key: 'facebook', icon: Facebook, href: social.facebook, label: 'Facebook' },
        { key: 'x', icon: Twitter, href: social.x, label: 'Twitter' },
        { key: 'instagram', icon: Instagram, href: social.instagram, label: 'Instagram' },
        { key: 'linkedin', icon: Linkedin, href: social.linkedin, label: 'LinkedIn' },
        { key: 'youtube', icon: Youtube, href: social.youtube, label: 'YouTube' },
      ].filter((item) => item.href)
    : defaultSocialLinks

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <div className="hidden md:flex items-center gap-1">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              <Link
                href={`/${locale}`}
                className="flex items-center"
                aria-label={resolvedLogoAlt}
              >
                <Image
                  src={resolvedLogo}
                  alt={resolvedLogoAlt}
                  width={180}
                  height={48}
                  className="h-10 lg:h-12 w-auto"
                  priority
                  unoptimized={logoExternal}
                />
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/search`}
                  aria-label={locale === 'ar' ? 'بحث' : 'Search'}
                  className="p-2 rounded-full text-neutral-500 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </Link>
                <LanguageSwitcher locale={locale} scrolled={true} />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
                  aria-label={locale === 'ar' ? 'القائمة' : 'Menu'}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav
          className="hidden lg:block bg-primary-600 shadow-lg"
          aria-label="Main navigation"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-0">
              {navItems.map((item) => {
                const itemUrl = navItemUrl(locale, item.href)
                const isActive = pathname === itemUrl
                const isOpen = activeDropdown === item.href
                return (
                  <li
                    key={`${item.href}-${item.label}`}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.href)}
                  >
                    <Link
                      href={itemUrl}
                      className={cn(
                        'relative flex items-center gap-1 px-4 py-4 text-sm font-semibold transition-colors whitespace-nowrap',
                        'text-white/80 hover:text-white',
                        isActive && 'text-white',
                        isOpen && 'text-white'
                      )}
                    >
                      {item.label}
                      {item.children && item.children.length > 0 && (
                        <svg className="w-3 h-3 mt-px opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary-500 rounded-full" />
                      )}
                      {!isActive && (
                        <span className={cn(
                          'absolute bottom-0 left-3 right-3 h-0.5 bg-white/30 rounded-full scale-x-0 transition-transform origin-center',
                          isOpen && 'scale-x-100'
                        )} />
                      )}
                    </Link>

                    {isOpen && (
                      <div className={cn(
                        'absolute top-full z-50 min-w-[280px] bg-white shadow-2xl border-t-2 border-secondary-500',
                        isRTL ? 'right-0' : 'left-0'
                      )}>
                        {item.children && item.children.length > 0 ? (
                          <div>
                            {item.description && (
                              <div className="px-5 py-4 bg-primary-50 border-b border-neutral-100">
                                <p className="text-xs text-primary-500 leading-relaxed">{item.description}</p>
                              </div>
                            )}
                            <ul className="py-2">
                              {item.children.map((child) => (
                                <li key={`${child.href}-${child.label}`}>
                                  <Link
                                    href={navItemUrl(locale, child.href)}
                                    className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 group transition-colors"
                                  >
                                    <Arrow className={cn(
                                      'w-4 h-4 mt-0.5 shrink-0 text-secondary-400 group-hover:text-secondary-500 transition-colors',
                                    )} />
                                    <div>
                                      <div className="text-sm font-semibold text-primary-600 group-hover:text-secondary-500 transition-colors">
                                        {child.label}
                                      </div>
                                      {child.description && (
                                        <div className="text-xs text-neutral-400 mt-0.5 leading-snug">
                                          {child.description}
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          item.description && (
                            <Link
                              href={itemUrl}
                              className="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 group transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Arrow className="w-4 h-4 text-secondary-500" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-primary-600 mb-1 group-hover:text-secondary-500 transition-colors">
                                  {item.label}
                                </div>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </header>

      <div className="h-16 lg:h-[132px]" />

      <MobileNav
        locale={locale}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </>
  )
}
