import type { CmsObservatoryPageData } from '@/lib/cms'

export const OBSERVATORY_PAGE_SECTION_ORDER = [
  'about',
  'dashboards',
  'reports',
  'report_form',
] as const

export type ObservatoryPageSectionKey = typeof OBSERVATORY_PAGE_SECTION_ORDER[number]

export const OBSERVATORY_SECTION_ANCHORS: Record<ObservatoryPageSectionKey, string> = {
  about: 'about',
  dashboards: 'dashboards',
  reports: 'reports',
  report_form: 'report',
}

export function resolveObservatoryPageSectionOrder(
  cms: CmsObservatoryPageData | null,
  connected: boolean,
): ObservatoryPageSectionKey[] {
  if (!connected || !cms?.sections_order?.length) {
    return [...OBSERVATORY_PAGE_SECTION_ORDER]
  }

  const valid = new Set<string>(OBSERVATORY_PAGE_SECTION_ORDER)
  const ordered = cms.sections_order.filter((key) => valid.has(key)) as ObservatoryPageSectionKey[]

  for (const key of OBSERVATORY_PAGE_SECTION_ORDER) {
    if (!ordered.includes(key)) {
      ordered.push(key)
    }
  }

  return ordered
}

export function observatorySectionVisible(
  cms: CmsObservatoryPageData | null,
  connected: boolean,
  key: ObservatoryPageSectionKey,
): boolean {
  if (!connected) return true
  const section = cms?.sections?.[key]
  return section?.is_visible ?? true
}
