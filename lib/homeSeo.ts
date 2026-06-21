import type { CmsHomeData } from '@/lib/cms'
import type { ResolvedSiteSettings } from '@/lib/siteSettings'
import type { Locale } from '@/types'
import { BASE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo'

export const HOME_SEO_DEFAULTS: Record<
  Locale,
  { title: string; description: string; ogImage: string }
> = {
  en: {
    title: 'We Rise Center for Citizenship & Development',
    description:
      'We Rise Center for Citizenship & Development — A Jordanian civil organization working in active citizenship, democracy, human rights, and digital rights',
    ogImage: DEFAULT_OG_IMAGE,
  },
  ar: {
    title: 'مركز We Rise للمواطنة والتنمية',
    description:
      'مركز We Rise للمواطنة والتنمية — منظمة مدنية أردنية تعمل في المواطنة الفاعلة، الديمقراطية، حقوق الإنسان، والحقوق الرقمية',
    ogImage: DEFAULT_OG_IMAGE,
  },
}

export function resolveHomeSeo(
  cms: CmsHomeData | null,
  locale: Locale,
  siteSettings?: ResolvedSiteSettings | null,
) {
  const staticDefaults = HOME_SEO_DEFAULTS[locale]
  const defaults = siteSettings
    ? {
        title: siteSettings.seo.defaultTitle,
        description: siteSettings.seo.defaultDescription,
        ogImage: siteSettings.seo.defaultImage,
      }
    : staticDefaults

  const page = cms?.page

  return {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
    noIndex: page ? !page.is_indexed : false,
    ogImage: defaults.ogImage,
  }
}
