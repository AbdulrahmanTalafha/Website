import type { Locale } from '@/types'
import { siteData } from '@/data/site'

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://werise.org.jo'

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
  const ogImg = ogImage ?? `${BASE_URL}/og-default.png`
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
      name: siteData.name[opts.locale],
      url: BASE_URL,
    },
  }
}

export function buildContactPageSchema(opts: {
  name: string
  description: string
  url: string
  locale: Locale
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.locale === 'ar' ? 'ar' : 'en',
    about: buildOrganizationSchema(opts.locale),
  }
}

export function buildServiceSchema(opts: {
  name: string
  description: string
  url: string
  locale: Locale
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
      name: siteData.name[opts.locale],
      url: BASE_URL,
    },
  }
}

export function buildOrganizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteData.name[locale],
    url: BASE_URL,
    logo: `${BASE_URL}/logo-en.svg`,
    sameAs: Object.values(siteData.social).filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JO',
      addressLocality: locale === 'ar' ? 'عمّان' : 'Amman',
    },
    email: siteData.email,
    telephone: siteData.phone,
  }
}

export function buildWebsiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteData.name[locale],
    url: BASE_URL,
    inLanguage: locale === 'ar' ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/search?q={search_term_string}`,
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    image: opts.image,
    author: opts.authorName
      ? { '@type': 'Person', name: opts.authorName }
      : { '@type': 'Organization', name: siteData.name[opts.locale] },
    publisher: {
      '@type': 'Organization',
      name: siteData.name[opts.locale],
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-en.svg` },
    },
  }
}

export function buildPublicationSchema(opts: {
  title: string
  description: string
  datePublished: string
  pdfUrl: string
  locale: Locale
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    url: opts.pdfUrl,
    publisher: { '@type': 'Organization', name: siteData.name[opts.locale] },
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
