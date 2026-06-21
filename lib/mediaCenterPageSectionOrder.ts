import type { CmsMediaCenterPageData } from '@/lib/cms'

export const MEDIA_CENTER_PAGE_SECTION_ORDER = [
  'media_grid',
] as const

export function resolveMediaCenterPageSectionOrder(
  cms: CmsMediaCenterPageData | null,
  connected: boolean,
): string[] {
  if (!connected || !cms?.sections_order?.length) {
    return [...MEDIA_CENTER_PAGE_SECTION_ORDER]
  }

  const valid = new Set(MEDIA_CENTER_PAGE_SECTION_ORDER)
  const ordered = cms.sections_order.filter((key) => valid.has(key as typeof MEDIA_CENTER_PAGE_SECTION_ORDER[number]))

  for (const key of MEDIA_CENTER_PAGE_SECTION_ORDER) {
    if (!ordered.includes(key)) {
      ordered.push(key)
    }
  }

  return ordered
}
