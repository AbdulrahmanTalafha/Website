/**
 * CMS API client — fetches content from WeRise-CMS-new Laravel backend.
 * Falls back to static data when the CMS is unreachable.
 */

import { cache } from 'react'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:8000'

// ─────────────────────────────────────────────
// Shared primitive types
// ─────────────────────────────────────────────

export interface CmsButton {
  label: string | null
  url: string | null
}

export interface CmsStat {
  value: string
  suffix: string
  label: string
}

// ─────────────────────────────────────────────
// Record types (module data)
// ─────────────────────────────────────────────

export interface CmsRecord {
  id: number
  slug: string
  title: string
  summary?: string | null
}

export interface CmsPublicationRecord extends CmsRecord {
  type: string
  publication_date?: string | null
  external_url?: string | null
}

export interface CmsProjectRecord extends CmsRecord {
  category?: string | null
  sector?: string | null
  start_date?: string | null
}

export interface CmsInitiativeRecord extends CmsRecord {
  category?: string | null
  start_date?: string | null
}

export interface CmsNewsRecord extends CmsRecord {
  content?: string | null
  category: string
  published_at?: string | null
  external_url?: string | null
}

export interface CmsPartnerRecord {
  id: number
  name: string
  description?: string | null
  website_url?: string | null
  category: string
}

// ─────────────────────────────────────────────
// Section types
// ─────────────────────────────────────────────

export interface CmsBaseSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  description?: string | null
  badge?: string | null
  primary_button?: CmsButton | null
  secondary_button?: CmsButton | null
}

export interface CmsFocusArea {
  title: string
  subtitle?: string | null
  icon: 'vote' | 'eye' | 'book-open' | 'political-empowerment' | 'economic-empowerment' | 'digital-media' | string
  color: 'primary' | 'secondary' | string
}

export interface CmsAboutIntroSection extends CmsBaseSection {
  key: 'about_intro'
  focus_areas?: CmsFocusArea[]
}

export interface CmsHeroSection extends CmsBaseSection {
  key: 'hero'
  tertiary_link?: { label: string | null; url: string | null } | null
  stats: CmsStat[]
  background_image?: string | null
}

export interface CmsStatsSection extends CmsBaseSection {
  key: 'home_stats'
  stats: CmsStat[]
}

export interface CmsNewsTickerSection extends CmsBaseSection {
  key: 'news_ticker'
  label?: string | null
  url?: string | null
  items: Array<{ id?: string; slug: string; title: string }>
}

export interface CmsCarouselSection extends CmsBaseSection {
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsRecord[]
}

export interface CmsPublicationsCarouselSection extends CmsBaseSection {
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsPublicationRecord[]
}

export interface CmsProjectsCarouselSection extends CmsBaseSection {
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsProjectRecord[]
}

export interface CmsInitiativesCarouselSection extends CmsBaseSection {
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsInitiativeRecord[]
}

export interface CmsLatestPublicationsSection extends CmsBaseSection {
  count?: number
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsPublicationRecord[]
}

export interface CmsLatestNewsSection extends CmsBaseSection {
  count?: number
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsNewsRecord[]
}

export interface CmsPartnersSection extends CmsBaseSection {
  view_all?: { label?: string | null; url?: string | null } | null
  records: CmsPartnerRecord[]
}

// ─────────────────────────────────────────────
// Top-level home data
// ─────────────────────────────────────────────

export interface CmsHomeSections {
  hero?: CmsHeroSection
  news_ticker?: CmsNewsTickerSection
  about_intro?: CmsAboutIntroSection
  publications_carousel?: CmsPublicationsCarouselSection
  home_stats?: CmsStatsSection
  projects_carousel?: CmsProjectsCarouselSection
  observatory_preview?: CmsBaseSection
  initiatives_carousel?: CmsInitiativesCarouselSection
  latest_publications?: CmsLatestPublicationsSection
  e_election_cta?: CmsBaseSection
  latest_news?: CmsLatestNewsSection
  partners?: CmsPartnersSection
  contact_cta?: CmsBaseSection
}

export interface CmsHomeData {
  page: {
    key: string
    seo_title: string | null
    seo_description: string | null
    is_indexed: boolean
    updated_at: string
  }
  sections: CmsHomeSections
}

// ─────────────────────────────────────────────
// General settings
// ─────────────────────────────────────────────

export interface CmsSettingsData {
  site: {
    name: string | null
    description: string | null
    url: string | null
  }
  branding: {
    main_logo: string | null
    main_logo_alt: string | null
    favicon: string | null
    apple_touch_icon: string | null
    default_og_image: string | null
  }
  contact: {
    email: string | null
    phone: string | null
    address: string | null
  }
  social: {
    facebook: string | null
    x: string | null
    instagram: string | null
    linkedin: string | null
    youtube: string | null
  }
  seo: {
    default_title: string | null
    default_description: string | null
    default_image: string | null
  }
  analytics: {
    google_analytics_id: string | null
    google_tag_manager_id: string | null
    google_site_verification: string | null
  }
}

// ─────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────

async function fetchCms<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CMS] Failed to fetch ${path}:`, err)
    }
    return null
  }
}

export const getHomeData = cache(async (locale: string): Promise<CmsHomeData | null> => {
  return fetchCms<CmsHomeData>(`/api/${locale}/home`)
})

export const getSettings = cache(async (locale: string): Promise<CmsSettingsData | null> => {
  return fetchCms<CmsSettingsData>(`/api/${locale}/settings`)
})

// ─────────────────────────────────────────────
// Section accessors
// ─────────────────────────────────────────────

export function getHeroSection(data: CmsHomeData | null): CmsHeroSection | null {
  if (!data?.sections?.hero) return null
  return data.sections.hero
}

export function getSection<K extends keyof CmsHomeSections>(
  data: CmsHomeData | null,
  key: K,
): CmsHomeSections[K] | null {
  if (!data?.sections?.[key]) return null
  return data.sections[key] as CmsHomeSections[K]
}
