import type { CmsContactPageData } from '@/lib/cms'
import type { Locale } from '@/types'

export const CONTACT_PAGE_SEO_DEFAULTS: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Contact Us',
    description:
      'Contact We Rise Center for inquiries, partnerships, and support in citizenship, democracy, and digital rights',
  },
  ar: {
    title: 'تواصل معنا',
    description:
      'تواصل مع مركز We Rise للاستفسارات والشراكات والدعم في مجالات المواطنة والديمقراطية والحقوق الرقمية',
  },
}

export function resolveContactPageSeo(cms: CmsContactPageData | null, locale: Locale) {
  const defaults = CONTACT_PAGE_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
