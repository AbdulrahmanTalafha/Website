import type { CmsMediaCenterPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const MEDIA_CENTER_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Media Center',
    description:
      'Follow We Rise Center news, press releases, media coverage, and activities in citizenship, digital rights, and democracy',
  },
  ar: {
    title: 'المركز الإعلامي',
    description:
      'تابع أخبار مركز We Rise وبياناته الصحفية وتغطياته الإعلامية وأنشطته في المواطنة والحقوق الرقمية والديمقراطية',
  },
}

export function resolveMediaCenterPageSeo(cms: CmsMediaCenterPageData | null, locale: Locale) {
  const defaults = MEDIA_CENTER_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
