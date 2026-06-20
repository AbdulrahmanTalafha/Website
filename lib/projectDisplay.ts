import type { Locale, Project } from '@/types'
import { formatBeneficiaryCount, formatBeneficiaryCountPlus } from '@/lib/mapCmsProject'

export function projectGenderLabel(project: Project, locale: Locale): string {
  if (project.targetGenderLabels?.length) {
    return project.targetGenderLabels.join(' · ')
  }

  const genders = project.targetGenders ?? []
  if (genders.length > 0) {
    return genders
      .map((g) =>
        g === 'female'
          ? locale === 'ar' ? 'إناث' : 'Female'
          : locale === 'ar' ? 'ذكور' : 'Male',
      )
      .join(' · ')
  }

  if (project.genderClassification === 'mixed') {
    return locale === 'ar' ? 'ذكور وإناث' : 'Mixed'
  }
  if (project.genderClassification === 'female') {
    return locale === 'ar' ? 'إناث' : 'Female'
  }
  if (project.genderClassification === 'male') {
    return locale === 'ar' ? 'ذكور' : 'Male'
  }

  return locale === 'ar' ? 'شباب' : 'Youth'
}

export function projectGeographicLevelLabel(project: Project, locale: Locale): string | null {
  if (project.geographicLevelLabel) return project.geographicLevelLabel

  if (project.geographicLevel === 'local') {
    return locale === 'ar' ? 'المستوى المحلي' : 'Local Level'
  }
  if (project.geographicLevel === 'national') {
    return locale === 'ar' ? 'المستوى الوطني' : 'National Level'
  }

  return null
}

export function projectBeneficiarySummary(project: Project, locale: Locale): string | null {
  const direct = project.directBeneficiaries
  const indirect = project.indirectBeneficiaries

  if (!direct && !indirect) return null

  const parts: string[] = []
  if (direct) {
    parts.push(
      locale === 'ar'
        ? `مباشر: ${formatBeneficiaryCountPlus(direct)}`
        : `Direct: ${formatBeneficiaryCountPlus(direct)}`,
    )
  }
  if (indirect) {
    parts.push(
      locale === 'ar'
        ? `غير مباشر: ${formatBeneficiaryCountPlus(indirect)}`
        : `Indirect: ${formatBeneficiaryCountPlus(indirect)}`,
    )
  }

  return parts.join(locale === 'ar' ? ' · ' : ' · ')
}
