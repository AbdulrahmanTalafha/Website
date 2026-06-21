/**
 * Resolve CMS media URLs for Home dynamic sections.
 * Uses absolute public API URLs when present; otherwise static/placeholder fallbacks.
 */
import { cmsAssetUrl } from '@/lib/cmsUrl'
import { rewriteLegacyImageUrl } from '@/lib/placeholderImages'

/** CMS or other remote URL — skip Next.js image optimizer (required for local CMS in dev). */
export function isCmsHostedMediaUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function cmsAbsoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return rewriteLegacyImageUrl(trimmed)
  }
  return cmsAssetUrl(trimmed)
}

export function resolveCmsMediaUrl(
  cmsUrl: string | null | undefined,
  staticFallback: string | undefined,
  placeholder: string,
): string {
  if (staticFallback) return rewriteLegacyImageUrl(staticFallback)
  const absolute = cmsAbsoluteMediaUrl(cmsUrl)
  if (absolute) return absolute
  return rewriteLegacyImageUrl(placeholder)
}
