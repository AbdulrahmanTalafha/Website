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
  footer: {
    newsletterTitle: string
    newsletterSubtitle: string
    newsletterPlaceholder: string
    newsletterButton: string
    copyrightSuffix: string
    bottomText: string
    sitemapLabel: string
  }
}

const staticLogo = (locale: Locale) =>
  locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg'

const footerDefaults = (locale: Locale) => ({
  newsletterTitle:
    locale === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to our newsletter',
  newsletterSubtitle:
    locale === 'ar'
      ? 'كن أول من يصلك أحدث تقاريرنا وفعالياتنا'
      : 'Be first to receive our latest reports and events',
  newsletterPlaceholder: locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email',
  newsletterButton: locale === 'ar' ? 'اشترك' : 'Subscribe',
  copyrightSuffix: locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.',
  bottomText: locale === 'ar' ? 'تأسس عام 2018 — عمّان، الأردن' : 'Founded 2018 — Amman, Jordan',
  sitemapLabel: locale === 'ar' ? 'خريطة الموقع' : 'Sitemap',
})

/**
 * Merge CMS general settings with static `data/site.ts` fallbacks.
 */
export function resolveSiteSettings(
  cms: CmsSettingsData | null,
  locale: Locale,
): ResolvedSiteSettings {
  const connected = Boolean(cms)
  const footerFallback = footerDefaults(locale)

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
    footer: {
      newsletterTitle:
        (connected && cms?.footer?.newsletter_title?.trim()) || footerFallback.newsletterTitle,
      newsletterSubtitle:
        (connected && cms?.footer?.newsletter_subtitle?.trim()) || footerFallback.newsletterSubtitle,
      newsletterPlaceholder:
        (connected && cms?.footer?.newsletter_placeholder?.trim()) || footerFallback.newsletterPlaceholder,
      newsletterButton:
        (connected && cms?.footer?.newsletter_button?.trim()) || footerFallback.newsletterButton,
      copyrightSuffix:
        (connected && cms?.footer?.copyright_suffix?.trim()) || footerFallback.copyrightSuffix,
      bottomText:
        (connected && cms?.footer?.bottom_text?.trim()) || footerFallback.bottomText,
      sitemapLabel:
        (connected && cms?.footer?.sitemap_label?.trim()) || footerFallback.sitemapLabel,
    },
  }
}

export function isExternalAsset(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}
