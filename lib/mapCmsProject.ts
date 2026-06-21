import type { Locale, Project } from '@/types'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'
import type { CmsProjectsListRecord } from '@/lib/cms'

function deriveGenderClassification(genders: ('male' | 'female')[]): Project['genderClassification'] {
  if (genders.includes('male') && genders.includes('female')) return 'mixed'
  if (genders.includes('female')) return 'female'
  if (genders.includes('male')) return 'male'

  return 'mixed'
}

export function mapCmsProjectToProject(record: CmsProjectsListRecord): Project {
  const placeholder = placeholderPhotoUrl(`project-${record.id}`, 800, 500)
  const targetGenders = (record.target_genders ?? []) as ('male' | 'female')[]
  const governorateKeys = record.governorate_keys ?? []
  const governorateLabels = record.governorates ?? []

  return {
    id: String(record.id),
    slug: record.slug,
    title: { ar: record.title_ar, en: record.title_en },
    shortDescription: {
      ar: record.summary_ar ?? '',
      en: record.summary_en ?? '',
    },
    fullDescription: {
      ar: record.description_ar ?? '',
      en: record.description_en ?? '',
    },
    donor: {
      ar: record.donor_ar ?? '',
      en: record.donor_en ?? '',
    },
    partnerId: record.partner_id ? String(record.partner_id) : undefined,
    startDate: record.start_date ?? '',
    endDate: record.end_date ?? '',
    status: (record.status ?? 'active') as Project['status'],
    sector: {
      ar: record.sector_ar ?? record.sector ?? '',
      en: record.sector_en ?? record.sector ?? '',
    },
    sectorKey: record.sector_key ?? 'political-empowerment',
    targetGroup: {
      ar: record.target_group_ar ?? '',
      en: record.target_group_en ?? '',
    },
    genderClassification: deriveGenderClassification(targetGenders),
    targetGenders,
    targetGenderLabels: record.target_gender_labels ?? undefined,
    ageGroups: record.age_groups ?? [],
    ageGroupKeys: record.age_group_keys ?? record.age_groups ?? [],
    governorateKeys: governorateKeys.length > 0 ? governorateKeys : governorateLabels,
    governorates: governorateLabels.length > 0 ? governorateLabels : governorateKeys,
    keyResults: (record.key_results ?? []).map((item) => ({
      ar: item.ar ?? '',
      en: item.en ?? '',
    })),
    images: (record.images ?? []).map((url) =>
      resolveCmsMediaUrl(url, undefined, placeholder),
    ),
    featuredImage: resolveCmsMediaUrl(record.featured_image, undefined, placeholder),
    relatedNews: record.related_news_ids?.map(String),
    relatedPublications: record.related_publication_ids?.map(String),
    geographicLevel: record.geographic_level as Project['geographicLevel'],
    geographicLevelLabel: record.geographic_level_label ?? undefined,
    directBeneficiaries: record.direct_beneficiaries ?? undefined,
    indirectBeneficiaries: record.indirect_beneficiaries ?? undefined,
  }
}

export function formatBeneficiaryCount(value: number): string {
  if (value >= 1000) {
    const k = Math.round(value / 1000)

    return `${k}K`
  }

  return String(value)
}

/** Compact count with leading + for KPI cards (e.g. +19K) */
export function formatBeneficiaryCountPlus(value: number): string {
  return `+${formatBeneficiaryCount(value)}`
}

export function projectMatchesGovernorate(project: Project, governorateKey: string): boolean {
  if (project.governorateKeys?.includes(governorateKey)) return true

  return project.governorates.includes(governorateKey)
}

export function projectMatchesGenderFilter(project: Project, filter: string): boolean {
  const genders = project.targetGenders ?? []

  if (filter === 'both') {
    return genders.includes('male') && genders.includes('female')
  }

  if (filter === 'female') return genders.includes('female')
  if (filter === 'male') return genders.includes('male')

  return true
}
