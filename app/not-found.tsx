import { Cairo, Inter } from 'next/font/google'
import NotFoundContent from '@/components/common/NotFoundContent'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

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

/** Fallback when no locale segment matches (outside `[locale]/layout`). */
export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col bg-neutral-50 font-arabic`}>
        <main className="flex-1 flex flex-col min-h-screen">
          <NotFoundContent locale="ar" />
        </main>
      </body>
    </html>
  )
}
