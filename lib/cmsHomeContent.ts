/**
 * Helpers for home page CMS content: when CMS is connected, empty fields are hidden.
 * When CMS is unavailable, static fallbacks are used.
 */

import { cmsUrl } from '@/lib/cmsUrl'

export function cmsConnected(cms: unknown): boolean {
  return Boolean(cms && typeof cms === 'object' && 'sections' in cms)
}

export function cmsText(
  connected: boolean,
  value: string | null | undefined,
  fallback: string,
): string | null {
  if (!connected) return fallback
  const trimmed = value?.trim()
  return trimmed || null
}

export interface CmsButtonDisplay {
  label: string
  url: string
}

export interface CmsSectionWithVisibility {
  is_visible?: boolean
}

export function cmsSectionVisible<T extends object>(
  connected: boolean,
  cms: T | undefined,
  key: keyof T,
): boolean {
  if (!connected) return true
  const section = cms?.[key] as CmsSectionWithVisibility | undefined
  if (!section) return false
  return section.is_visible !== false
}

export function cmsRichHtml(
  connected: boolean,
  value: string | null | undefined,
  fallback: string,
): string | null {
  if (!connected) return fallback
  const trimmed = value?.trim()
  if (!trimmed) return null
  const textOnly = trimmed.replace(/<[^>]*>/g, '').trim()
  if (!textOnly) return null
  return trimmed
}

export function cmsButton(
  connected: boolean,
  button: { label?: string | null; url?: string | null } | null | undefined,
  fallbackLabel: string,
  fallbackUrl: string,
  locale: string,
): CmsButtonDisplay | null {
  if (!connected) {
    return { label: fallbackLabel, url: cmsUrl(fallbackUrl, locale) }
  }
  const label = button?.label?.trim()
  if (!label) return null
  const rawUrl = button?.url?.trim() || fallbackUrl
  return { label, url: cmsUrl(rawUrl, locale) }
}
