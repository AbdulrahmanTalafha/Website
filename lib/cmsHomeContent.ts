/**
 * Helpers for home page CMS content: when CMS is connected, empty fields are hidden.
 * When CMS is unavailable, static fallbacks are used.
 */

import type { CmsHomeSections } from '@/lib/cms'
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

export function cmsSectionVisible(
  connected: boolean,
  cms: CmsHomeSections | undefined,
  key: keyof CmsHomeSections,
): boolean {
  if (!connected) return true
  const section = cms?.[key]
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
