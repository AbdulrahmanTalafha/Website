import type { CmsPartnersPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const PARTNERS_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Partners & Supporters',
    description:
      'Meet We Rise Center local and international partners and supporters in democracy, human rights, and digital rights programs',
  },
  ar: {
    title: 'الشركاء والداعمون',
    description:
      'تعرّف على شركاء وداعمي مركز We Rise المحليين والدوليين في برامج الديمقراطية وحقوق الإنسان والحقوق الرقمية',
  },
}

export function resolvePartnersPageSeo(cms: CmsPartnersPageData | null, locale: Locale) {
  const defaults = PARTNERS_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
