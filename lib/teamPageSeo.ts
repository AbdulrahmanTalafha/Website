import type { CmsTeamPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const TEAM_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Team & Governance',
    description: 'Meet the We Rise Center team and institutional governance structure',
  },
  ar: {
    title: 'الفريق والحوكمة',
    description: 'تعرف على فريق مركز We Rise وهيكل الحوكمة المؤسسية',
  },
}

export function resolveTeamPageSeo(cms: CmsTeamPageData | null, locale: Locale) {
  const defaults = TEAM_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
