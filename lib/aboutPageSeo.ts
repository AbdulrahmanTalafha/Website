import type { CmsAboutPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const ABOUT_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'About Us',
    description: 'Learn about We Rise Center — our vision, mission, values, team, and governance',
  },
  ar: {
    title: 'من نحن',
    description: 'تعرّف على مركز نحن ننهض — رؤيتنا، رسالتنا، قيمنا، فريقنا، والحوكمة',
  },
}

export function resolveAboutPageSeo(cms: CmsAboutPageData | null, locale: Locale) {
  const defaults = ABOUT_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
