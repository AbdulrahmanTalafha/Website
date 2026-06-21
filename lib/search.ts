import type { Locale } from '@/types'
import { rewriteLegacyImageUrl } from '@/lib/placeholderImages'

const CMS_URL = process.env.CMS_INTERNAL_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://127.0.0.1:8000'

export interface SearchResultItem {
  id: string
  type: string
  title: string
  excerpt: string
  url: string
  image?: string | null
  slug?: string
  date?: string | null
}

export interface SearchResultGroup {
  type: string
  label: string
  items: SearchResultItem[]
}

export interface SiteSearchResponse {
  query: string
  total: number
  groups: SearchResultGroup[]
}

export async function fetchSiteSearch(
  locale: Locale,
  query: string,
  limit = 8,
): Promise<SiteSearchResponse | null> {
  const q = query.trim()
  if (q.length < 2) return null

  try {
    const params = new URLSearchParams({ q, limit: String(limit) })
    const res = await fetch(`${CMS_URL}/api/${locale}/search?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) return null

    const data = (await res.json()) as SiteSearchResponse
    return {
      ...data,
      groups: data.groups.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          image: item.image ? rewriteLegacyImageUrl(item.image) : item.image,
        })),
      })),
    }
  } catch {
    return null
  }
}
