/**
 * Prepend locale prefix to CMS-relative URLs when needed.
 */
export function cmsUrl(url: string | null | undefined, locale: string): string {
  if (!url) return '#'
  if (url.startsWith('/') && !url.startsWith(`/${locale}/`)) {
    return `/${locale}${url}`
  }
  return url
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ?? ''

/**
 * Resolve CMS-hosted files for the browser using NEXT_PUBLIC_CMS_URL.
 * Rewrites internal Docker hosts (e.g. host.docker.internal) from API responses.
 */
export function cmsAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.pathname.includes('/storage/') && CMS_URL) {
        return `${CMS_URL}${parsed.pathname}${parsed.search}`
      }
    } catch {
      // fall through
    }
    return trimmed
  }

  if (!CMS_URL) return trimmed

  const storageIndex = trimmed.indexOf('/storage/')
  if (storageIndex !== -1) {
    return `${CMS_URL}${trimmed.slice(storageIndex)}`
  }

  if (trimmed.startsWith('/')) {
    return `${CMS_URL}${trimmed}`
  }

  return trimmed
}
