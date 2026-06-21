import type { Locale } from '@/types'
import { siteData } from '@/data/site'
import type { ResolvedSiteSettings } from '@/lib/siteSettings'

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://werise.org.jo'

/** Static fallback when CMS default OG image is not set (file lives in /public). */
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.svg`

function resolveSchemaSiteName(locale: Locale, site?: ResolvedSiteSettings | null): string {
  return site?.name ?? siteData.name[locale]
}

function resolveSchemaSiteUrl(site?: ResolvedSiteSettings | null): string {
  const url = site?.url?.trim()
  return url || BASE_URL
}

function resolveSchemaLogoUrl(locale: Locale, site?: ResolvedSiteSettings | null): string {
  const src = site?.branding.logoSrc ?? (locale === 'ar' ? '/logo-ar.svg' : '/logo-en.svg')
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return `${BASE_URL}${src.startsWith('/') ? src : `/${src}`}`
}

function resolveSchemaSameAs(site?: ResolvedSiteSettings | null): string[] {
  if (!site?.social) {
    return Object.values(siteData.social).filter(Boolean)
  }

  return [
    site.social.facebook,
    site.social.x,
    site.social.instagram,
    site.social.linkedin,
    site.social.youtube,
  ].filter((url): url is string => Boolean(url?.trim()))
}

function resolveSchemaAddressLocality(locale: Locale, site?: ResolvedSiteSettings | null): string {
  const address = site?.contact.address?.trim()
  if (address) {
    return address
  }

  return locale === 'ar' ? 'عمّان' : 'Amman'
}

interface SeoOptions {
  locale: Locale
  titleKey?: string
  descriptionKey?: string
  customTitle?: string
  customDescription?: string
  ogImage?: string
  canonicalPath: string
  noIndex?: boolean
  ogType?: 'website' | 'article'
  /** Use full title as-is (skip layout title template). Best for homepage meta title. */
  absoluteTitle?: boolean
  /** Override Open Graph site name (e.g. from CMS general settings). */
  siteName?: string
}

export function buildMetadata(opts: SeoOptions) {
  const {
    locale,
    customTitle,
    customDescription,
    ogImage,
    canonicalPath,
    noIndex,
    ogType,
    absoluteTitle,
    siteName: siteNameOverride,
  } = opts

  const siteName = siteNameOverride ?? siteData.name[locale]
  const title = customTitle ?? siteName
  const description = customDescription ?? siteData.description[locale]
  const ogImg = ogImage ?? DEFAULT_OG_IMAGE
  const canonical = `${BASE_URL}${canonicalPath}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages: {
        ar: `${BASE_URL}${canonicalPath.replace(`/${locale}`, '/ar')}`,
        en: `${BASE_URL}${canonicalPath.replace(`/${locale}`, '/en')}`,
        'x-default': `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: ogType ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImg],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildCollectionPageSchema(opts: {
  name: string
  description: string
  url: string
  locale: Locale
  site?: ResolvedSiteSettings | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.locale === 'ar' ? 'ar' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: resolveSchemaSiteName(opts.locale, opts.site),
      url: resolveSchemaSiteUrl(opts.site),
    },
  }
}

export function buildContactPageSchema(opts: {
  name: string
  description: string
  url: string
  locale: Locale
  site?: ResolvedSiteSettings | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.locale === 'ar' ? 'ar' : 'en',
    about: buildOrganizationSchema(opts.locale, opts.site),
  }
}

export function buildServiceSchema(opts: {
  name: string
  description: string
  url: string
  locale: Locale
  site?: ResolvedSiteSettings | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    areaServed: 'JO',
    provider: {
      '@type': 'Organization',
      name: resolveSchemaSiteName(opts.locale, opts.site),
      url: resolveSchemaSiteUrl(opts.site),
    },
  }
}

export function buildOrganizationSchema(
  locale: Locale,
  site?: ResolvedSiteSettings | null,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: resolveSchemaSiteName(locale, site),
    url: resolveSchemaSiteUrl(site),
    logo: resolveSchemaLogoUrl(locale, site),
    sameAs: resolveSchemaSameAs(site),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JO',
      addressLocality: resolveSchemaAddressLocality(locale, site),
    },
    email: site?.contact.email ?? siteData.email,
    telephone: site?.contact.phone ?? siteData.phone,
  }
}

export function buildWebsiteSchema(
  locale: Locale,
  site?: ResolvedSiteSettings | null,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: resolveSchemaSiteName(locale, site),
    url: resolveSchemaSiteUrl(site),
    inLanguage: locale === 'ar' ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${resolveSchemaSiteUrl(site)}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildArticleSchema(opts: {
  title: string
  description: string
  datePublished: string
  image?: string
  authorName?: string
  locale: Locale
  site?: ResolvedSiteSettings | null
}) {
  const orgName = resolveSchemaSiteName(opts.locale, opts.site)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    image: opts.image,
    author: opts.authorName
      ? { '@type': 'Person', name: opts.authorName }
      : { '@type': 'Organization', name: orgName },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      logo: {
        '@type': 'ImageObject',
        url: resolveSchemaLogoUrl(opts.locale, opts.site),
      },
    },
  }
}

export function buildPublicationSchema(opts: {
  title: string
  description: string
  datePublished: string
  pdfUrl: string
  locale: Locale
  site?: ResolvedSiteSettings | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    url: opts.pdfUrl,
    publisher: {
      '@type': 'Organization',
      name: resolveSchemaSiteName(opts.locale, opts.site),
    },
    inLanguage: opts.locale === 'ar' ? 'ar' : 'en',
  }
}

export function buildPersonSchema(opts: {
  name: string
  jobTitle: string
  email: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    jobTitle: opts.jobTitle,
    email: opts.email,
    image: opts.image,
    worksFor: { '@type': 'Organization', name: 'We Rise' },
  }
}
