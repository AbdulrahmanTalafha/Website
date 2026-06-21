import type { Initiative, InitiativeCategory, Locale } from '@/types'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'
import type { CmsInitiativeListRecord } from '@/lib/cms'

function mapOutputs(outputs: CmsInitiativeListRecord['outputs']): Array<Record<Locale, string>> {
  return (outputs ?? []).map((item) => ({
    en: item.en ?? '',
    ar: item.ar ?? '',
  }))
}

function cmsSummary(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ?? ''
}

export function mapCmsInitiativeToInitiative(record: CmsInitiativeListRecord): Initiative {
  const placeholder = placeholderPhotoUrl(`initiative-${record.id}`, 800, 500)
  const categoryKey = (record.category_key ?? 'initiative') as InitiativeCategory

  return {
    id: String(record.id),
    slug: record.slug,
    title: { ar: record.title_ar, en: record.title_en },
    shortDescription: {
      ar: cmsSummary(record.summary_ar),
      en: cmsSummary(record.summary_en),
    },
    description: {
      ar: record.description_ar ?? '',
      en: record.description_en ?? '',
    },
    objective: {
      ar: record.objective_ar ?? '',
      en: record.objective_en ?? '',
    },
    outputs: mapOutputs(record.outputs),
    category: categoryKey,
    reachValue: record.reach_value ?? undefined,
    reachSuffix: {
      en: record.reach_suffix_en?.trim() ?? '',
      ar: record.reach_suffix_ar?.trim() ?? '',
    },
    images: (record.images ?? []).map((src) => resolveCmsMediaUrl(src, undefined, placeholder)),
    videos: record.videos ?? undefined,
    relatedProject: record.related_project_slug ?? undefined,
    startDate: record.start_date ?? '',
    endDate: record.end_date ?? undefined,
    featuredImage: resolveCmsMediaUrl(record.featured_image, undefined, placeholder),
  }
}
