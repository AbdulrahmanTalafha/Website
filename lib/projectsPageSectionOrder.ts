import type { CmsProjectsPageData } from '@/lib/cms'

export const DEFAULT_PROJECTS_PAGE_SECTION_ORDER = [
  'stats_kpi',
  'dashboard',
  'projects_grid',
] as const

const KNOWN_KEYS = new Set<string>(['hero', ...DEFAULT_PROJECTS_PAGE_SECTION_ORDER])

export function resolveProjectsPageSectionOrder(
  cmsData: CmsProjectsPageData | null,
  connected: boolean,
): string[] {
  if (!connected || !cmsData) {
    return [...DEFAULT_PROJECTS_PAGE_SECTION_ORDER]
  }

  const visibleKeys = new Set(Object.keys(cmsData.sections ?? {}).filter((k) => k !== 'hero'))

  const fromOrder = cmsData.sections_order?.filter(
    (key) => key !== 'hero' && KNOWN_KEYS.has(key) && visibleKeys.has(key),
  )
  if (fromOrder && fromOrder.length > 0) {
    return dedupe(fromOrder)
  }

  const fromList = cmsData.sections_list
    ?.filter((item) => item.is_visible)
    .map((item) => item.key)
    .filter((key) => key !== 'hero' && KNOWN_KEYS.has(key) && visibleKeys.has(key))

  if (fromList && fromList.length > 0) {
    return dedupe(fromList)
  }

  return dedupe([...DEFAULT_PROJECTS_PAGE_SECTION_ORDER].filter((key) => visibleKeys.has(key)))
}

function dedupe(keys: string[]): string[] {
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
