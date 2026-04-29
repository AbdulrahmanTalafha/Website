import type { Metadata } from 'next'
import '../globals.css'
import { notFound } from 'next/navigation'
import { isValidLocale, getDir } from '@/lib/i18n'
import type { Locale } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollReveal from '@/components/layout/ScrollReveal'
import AutoBreadcrumb from '@/components/layout/AutoBreadcrumb'

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
    icons: { icon: '/favicon.ico' },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dir = getDir(locale as Locale)

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-neutral-50 ${dir === 'rtl' ? 'font-arabic' : 'font-sans'}`}>
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
