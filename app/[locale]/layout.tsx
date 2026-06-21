import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import '../globals.css'
import { notFound } from 'next/navigation'
import { isValidLocale, getDir } from '@/lib/i18n'
import type { Locale } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollReveal from '@/components/layout/ScrollReveal'
import AutoBreadcrumb from '@/components/layout/AutoBreadcrumb'
import { getSettings, getNavigationData } from '@/lib/cms'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { mapCmsFooterNav, mapCmsHeaderNav } from '@/lib/mapNavigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const settings = await getSettings(locale)
  const site = resolveSiteSettings(settings, locale as Locale)
  const faviconType = site.branding.favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : undefined

  return {
    title: {
      template: locale === 'ar'
        ? `%s | ${site.name}`
        : `%s | ${site.name}`,
      default: site.name,
    },
    icons: {
      icon: [
        { url: site.branding.favicon, type: faviconType },
      ],
      apple: [{ url: site.branding.appleTouchIcon }],
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dir = getDir(locale as Locale)
  const settings = await getSettings(locale)
  const site = resolveSiteSettings(settings, locale as Locale)
  const navCms = await getNavigationData(locale)
  const headerNav = mapCmsHeaderNav(navCms, locale as Locale)
  const footerNav = mapCmsFooterNav(navCms, locale as Locale)

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col bg-neutral-50 ${dir === 'rtl' ? 'font-arabic' : 'font-sans'}`}>
        <Header
          locale={locale as Locale}
          logoSrc={site.branding.logoSrc}
          logoAlt={site.branding.logoAlt}
          social={site.social}
          navItems={headerNav}
        />
        <div className="flex-1 flex flex-col min-h-0">
          <AutoBreadcrumb />
          <main className="flex-1 min-h-0 flex flex-col">{children}</main>
        </div>
        <Footer locale={locale as Locale} site={site} footerSections={footerNav} />
        <ScrollReveal />
      </body>
    </html>
  )
}
