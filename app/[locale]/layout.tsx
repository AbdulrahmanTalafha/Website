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
  return {
    title: {
      template: locale === 'ar'
        ? '%s | مركز We Rise للمواطنة والتنمية'
        : '%s | We Rise Center for Citizenship & Development',
      default: locale === 'ar'
        ? 'مركز We Rise للمواطنة والتنمية'
        : 'We Rise Center for Citizenship & Development',
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dir = getDir(locale as Locale)

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col bg-neutral-50 ${dir === 'rtl' ? 'font-arabic' : 'font-sans'}`}>
        <Header locale={locale as Locale} />
        <div className="flex-1 flex flex-col">
          <AutoBreadcrumb />
          <main className="flex-1 min-h-0">{children}</main>
        </div>
        <Footer locale={locale as Locale} />
        <ScrollReveal />
      </body>
    </html>
  )
}
