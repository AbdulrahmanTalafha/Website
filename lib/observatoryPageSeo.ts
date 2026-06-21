import type { CmsObservatoryPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const OBSERVATORY_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Digital Observatory for Hate Speech & Digital Violence',
    description:
      'The We Rise Digital Observatory monitors and analyzes hate speech and digital violence, providing reports and data on digital safety in Jordan.',
  },
  ar: {
    title: 'المرصد الرقمي لخطاب الكراهية والعنف الرقمي',
    description:
      'المرصد الرقمي من مركز We Rise لرصد وتحليل خطاب الكراهية والعنف الرقمي وتقديم تقارير وبيانات حول السلامة الرقمية في الأردن.',
  },
}

export function resolveObservatoryPageSeo(cms: CmsObservatoryPageData | null, locale: Locale) {
  const defaults = OBSERVATORY_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
