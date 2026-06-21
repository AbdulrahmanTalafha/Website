import type { CmsPublicationsPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const PUBLICATIONS_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Publications & Reports',
    description:
      'Research, reports, studies, and policy papers from We Rise Center on democracy, digital rights, and hate speech',
  },
  ar: {
    title: 'المنشورات والتقارير',
    description:
      'أبحاث وتقارير ودراسات وأوراق سياسات صادرة عن مركز We Rise في الديمقراطية والحقوق الرقمية وخطاب الكراهية',
  },
}

export function resolvePublicationsPageSeo(cms: CmsPublicationsPageData | null, locale: Locale) {
  const defaults = PUBLICATIONS_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
