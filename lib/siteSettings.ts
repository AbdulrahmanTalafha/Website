import { siteData } from '@/data/site'
import type { CmsSettingsData } from '@/lib/cms'
import { BASE_URL } from '@/lib/seo'
import type { Locale } from '@/types'

export type ResolvedSiteSettings = {
  name: string
  description: string
  url: string
  branding: {
    logoSrc: string
    logoAlt: string
    favicon: string
    appleTouchIcon: string
    defaultOgImage: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook?: string
    x?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    defaultImage: string
  }
  analytics: {
    googleAnalyticsId: string | null
    googleTagManagerId: string | null
    googleSiteVerification: string | null
  }
}

const staticLogo = (locale: Locale) =>
  locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg'

/**
 * Merge CMS general settings with static `data/site.ts` fallbacks.
 */
export function resolveSiteSettings(
  cms: CmsSettingsData | null,
  locale: Locale,
): ResolvedSiteSettings {
  const connected = Boolean(cms)

  const defaultOg = `${BASE_URL}/og-default.png`

  return {
    name:
      (connected && cms?.site?.name?.trim()) || siteData.name[locale],
    description:
      (connected && cms?.site?.description?.trim()) || siteData.description[locale],
    url: (connected && cms?.site?.url?.trim()) || siteData.url,
    branding: {
      logoSrc: cms?.branding?.main_logo?.trim() || staticLogo(locale),
      logoAlt:
        cms?.branding?.main_logo_alt?.trim() || siteData.name[locale],
      favicon: cms?.branding?.favicon?.trim() || '/favicon.svg',
      appleTouchIcon:
        cms?.branding?.apple_touch_icon?.trim() || '/apple-touch-icon.svg',
      defaultOgImage:
        cms?.branding?.default_og_image?.trim()
        || cms?.seo?.default_image?.trim()
        || defaultOg,
    },
    contact: {
      email: (connected && cms?.contact?.email?.trim()) || siteData.email,
      phone: (connected && cms?.contact?.phone?.trim()) || siteData.phone,
      address:
        (connected && cms?.contact?.address?.trim()) || siteData.address[locale],
    },
    social: {
      facebook: cms?.social?.facebook?.trim() || siteData.social.facebook,
      x: cms?.social?.x?.trim() || siteData.social.twitter,
      instagram: cms?.social?.instagram?.trim() || siteData.social.instagram,
      linkedin: cms?.social?.linkedin?.trim() || siteData.social.linkedin,
      youtube: cms?.social?.youtube?.trim() || siteData.social.youtube,
    },
    seo: {
      defaultTitle:
        (connected && cms?.seo?.default_title?.trim()) || siteData.name[locale],
      defaultDescription:
        (connected && cms?.seo?.default_description?.trim())
        || siteData.description[locale],
      defaultImage:
        cms?.seo?.default_image?.trim()
        || cms?.branding?.default_og_image?.trim()
        || defaultOg,
    },
    analytics: {
      googleAnalyticsId: cms?.analytics?.google_analytics_id ?? null,
      googleTagManagerId: cms?.analytics?.google_tag_manager_id ?? null,
      googleSiteVerification: cms?.analytics?.google_site_verification ?? null,
    },
  }
}

export function isExternalAsset(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}
