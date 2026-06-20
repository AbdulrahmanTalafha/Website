import type { CmsHomeData } from '@/lib/cms'

/** Static fallback section order when CMS/API is unavailable or order metadata is missing. */
export const DEFAULT_HOME_SECTION_ORDER = [
  'news_ticker',
  'about_intro',
  'publications_carousel',
  'home_stats',
  'projects_carousel',
  'observatory_preview',
  'initiatives_carousel',
  'latest_publications',
  'e_election_cta',
  'latest_news',
  'partners',
  'contact_cta',
] as const

export type HomeSectionKey = typeof DEFAULT_HOME_SECTION_ORDER[number] | 'hero'

const KNOWN_SECTION_KEYS = new Set<string>([
  'hero',
  ...DEFAULT_HOME_SECTION_ORDER,
])

/**
 * Resolve render order for reorderable Home sections (hero is always rendered separately first).
 */
export function resolveHomeSectionOrder(
  cmsData: CmsHomeData | null,
  connected: boolean,
): string[] {
  if (!connected || !cmsData) {
    return [...DEFAULT_HOME_SECTION_ORDER]
  }

  const fromOrder = cmsData.sections_order?.filter((key) => key !== 'hero' && KNOWN_SECTION_KEYS.has(key))
  if (fromOrder && fromOrder.length > 0) {
    return dedupeKeys(fromOrder)
  }

  const fromList = cmsData.sections_list
    ?.map((item) => item.key)
    .filter((key) => key !== 'hero' && KNOWN_SECTION_KEYS.has(key))

  if (fromList && fromList.length > 0) {
    return dedupeKeys(fromList)
  }

  return [...DEFAULT_HOME_SECTION_ORDER]
}

function dedupeKeys(keys: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const key of keys) {
    if (!seen.has(key)) {
      seen.add(key)
      result.push(key)
    }
  }

  return result
}
