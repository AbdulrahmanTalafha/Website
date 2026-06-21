import type { CmsPublicationsPageData } from '@/lib/cms'

export const PUBLICATIONS_PAGE_SECTION_ORDER = [
  'publications_grid',
] as const

export function resolvePublicationsPageSectionOrder(
  cms: CmsPublicationsPageData | null,
  connected: boolean,
): string[] {
  if (!connected || !cms?.sections_order?.length) {
    return [...PUBLICATIONS_PAGE_SECTION_ORDER]
  }

  const valid = new Set(PUBLICATIONS_PAGE_SECTION_ORDER)
  const ordered = cms.sections_order.filter((key) => valid.has(key as typeof PUBLICATIONS_PAGE_SECTION_ORDER[number]))

  for (const key of PUBLICATIONS_PAGE_SECTION_ORDER) {
    if (!ordered.includes(key)) {
      ordered.push(key)
    }
  }

  return ordered
}
