import type { Initiative, Locale } from '@/types'

export function formatInitiativeReachValue(value: number, locale: Locale): string {
  return `+${value.toLocaleString(locale === 'ar' ? 'ar-JO' : 'en-US')}`
}

export function formatInitiativeReach(initiative: Initiative, locale: Locale): string | null {
  if (!initiative.reachValue || initiative.reachValue <= 0) {
    return null
  }

  const suffix = initiative.reachSuffix?.[locale]?.trim()
  const number = formatInitiativeReachValue(initiative.reachValue, locale)

  return suffix ? `${number} ${suffix}` : number
}
