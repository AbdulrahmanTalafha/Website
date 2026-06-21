import NotFoundContent from '@/components/common/NotFoundContent'
import { defaultLocale, isValidLocale } from '@/lib/i18n'
import type { Locale } from '@/types'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0]
  return isValidLocale(segment) ? segment : defaultLocale
}

async function resolveLocale(): Promise<Locale> {
  const h = await headers()
  const pathname =
    h.get('x-pathname') ??
    h.get('next-url')?.replace(/^https?:\/\/[^/]+/, '') ??
    h.get('referer')?.replace(/^https?:\/\/[^/]+/, '') ??
    ''

  return localeFromPathname(pathname)
}

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default async function LocaleNotFound() {
  const locale = await resolveLocale()

  return <NotFoundContent locale={locale} />
}
