import type { Locale } from '@/types'

export const locales: Locale[] = ['ar', 'en']
export const defaultLocale: Locale = 'ar'

export function getDir(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getAlternateHref(currentPath: string, targetLocale: Locale): string {
  const segments = currentPath.split('/')
  segments[1] = targetLocale
  return segments.join('/')
}

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export function t<T>(obj: Record<Locale, T>, locale: Locale): T {
  return obj[locale] ?? obj[defaultLocale]
}
