import type { CmsHomeData } from '@/lib/cms'
import type { Locale } from '@/types'

export const HOME_SEO_DEFAULTS: Record<
  Locale,
  { title: string; description: string }
> = {
  en: {
    title: 'We Rise Center for Citizenship & Development',
    description:
      'We Rise Center for Citizenship & Development — A Jordanian civil organization working in active citizenship, democracy, human rights, and digital rights',
  },
  ar: {
    title: 'مركز We Rise للمواطنة والتنمية',
    description:
      'مركز We Rise للمواطنة والتنمية — منظمة مدنية أردنية تعمل في المواطنة الفاعلة، الديمقراطية، حقوق الإنسان، والحقوق الرقمية',
  },
}

export function resolveHomeSeo(cms: CmsHomeData | null, locale: Locale) {
  const defaults = HOME_SEO_DEFAULTS[locale]
  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
  }
}
