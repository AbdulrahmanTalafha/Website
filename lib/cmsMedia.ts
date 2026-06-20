/**
 * Resolve CMS media URLs for Home dynamic sections.
 * Uses absolute public API URLs when present; otherwise static/placeholder fallbacks.
 */
import { cmsAssetUrl } from '@/lib/cmsUrl'

export function cmsAbsoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return cmsAssetUrl(trimmed)
}

export function resolveCmsMediaUrl(
  cmsUrl: string | null | undefined,
  staticFallback: string | undefined,
  placeholder: string,
): string {
  if (staticFallback) return staticFallback
  const absolute = cmsAbsoluteMediaUrl(cmsUrl)
  if (absolute) return absolute
  return placeholder
}
