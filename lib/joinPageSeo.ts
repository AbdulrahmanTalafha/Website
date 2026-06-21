import type { CmsJoinPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const JOIN_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Join Us',
    description:
      'Apply to volunteer, intern, or collaborate with We Rise Center in citizenship, democracy, and digital rights',
  },
  ar: {
    title: 'انضم إلينا',
    description:
      'قدّم طلبك للتطوع أو التدريب أو الشراكة مع مركز We Rise في مجالات المواطنة والديمقراطية والحقوق الرقمية',
  },
}

export function resolveJoinPageSeo(cms: CmsJoinPageData | null, locale: Locale) {
  const defaults = JOIN_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
