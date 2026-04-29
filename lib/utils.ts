import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatNumber(n: number, locale: string): string {
  return n.toLocaleString(locale === 'ar' ? 'ar-JO' : 'en-JO')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export function localePath(locale: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}
