import type { CmsInitiativesPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const INITIATIVES_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Initiatives & Campaigns',
    description:
      'Explore We Rise Center initiatives and campaigns promoting civic participation, countering hate speech, and raising digital rights awareness',
  },
  ar: {
    title: 'المبادرات والحملات',
    description:
      'تعرّف على مبادرات وحملات مركز We Rise لتعزيز المشاركة المدنية ومواجهة خطاب الكراهية والتوعية بالحقوق الرقمية',
  },
}

export function resolveInitiativesPageSeo(cms: CmsInitiativesPageData | null, locale: Locale) {
  const defaults = INITIATIVES_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
