import type { CmsProjectsPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const PROJECTS_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Programs & Projects',
    description:
      'Explore all We Rise Center programs and projects in citizenship, democracy, digital rights, and social cohesion',
  },
  ar: {
    title: 'البرامج والمشاريع',
    description:
      'استعرض جميع برامج ومشاريع مركز We Rise في مجالات المواطنة والديمقراطية والحقوق الرقمية والتماسك الاجتماعي',
  },
}

export function resolveProjectsPageSeo(cms: CmsProjectsPageData | null, locale: Locale) {
  const defaults = PROJECTS_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
