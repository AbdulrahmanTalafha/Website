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
 * Resolve CMS-hosted files (e.g. /storage/...) using NEXT_PUBLIC_CMS_URL.
 */
export function cmsAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (!CMS_URL) return url

  const storageIndex = url.indexOf('/storage/')
  if (storageIndex !== -1) {
    return `${CMS_URL}${url.slice(storageIndex)}`
  }

  if (url.startsWith('/')) {
    return `${CMS_URL}${url}`
  }

  return url
}
