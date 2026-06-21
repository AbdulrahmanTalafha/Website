/**
 * CMS API client — fetches content from WeRise-CMS-new Laravel backend.
 * Falls back to static data when the CMS is unreachable.
 */

import { cache } from 'react'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://127.0.0.1:8000'

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
  cover_image?: string | null
  image?: string | null
}

export interface CmsProjectRecord extends CmsRecord {
  category?: string | null
  sector?: string | null
  start_date?: string | null
  featured_image?: string | null
  image?: string | null
}

export interface CmsInitiativeRecord extends CmsRecord {
  category?: string | null
  start_date?: string | null
  featured_image?: string | null
  image?: string | null
}

export interface CmsNewsRecord extends CmsRecord {
  content?: string | null
  category: string
  published_at?: string | null
  external_url?: string | null
  image?: string | null
  cover_image?: string | null
}

export interface CmsPartnerRecord {
  id: number
  name: string
  name_en?: string
  name_ar?: string
  description?: string | null
  website_url?: string | null
  category: string
  logo?: string | null
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
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: unknown
  }>
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
  footer: {
    newsletter_title: string | null
    newsletter_subtitle: string | null
    newsletter_placeholder: string | null
    newsletter_button: string | null
    copyright_suffix: string | null
    bottom_text: string | null
    sitemap_label: string | null
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

export interface CmsPartnersListRecord {
  id: number
  name_en: string
  name_ar: string
  description_en?: string | null
  description_ar?: string | null
  website_url?: string | null
  category: string
  logo?: string | null
}

export interface CmsPartnersData {
  records: CmsPartnersListRecord[]
}

export const getPartnersData = cache(async (locale: string): Promise<CmsPartnersData | null> => {
  return fetchCms<CmsPartnersData>(`/api/${locale}/partners`)
})

export interface CmsProjectKeyResult {
  en?: string | null
  ar?: string | null
}

export interface CmsProjectsListRecord {
  id: number
  slug: string
  title_en: string
  title_ar: string
  summary_en?: string | null
  summary_ar?: string | null
  description_en?: string | null
  description_ar?: string | null
  donor_en?: string | null
  donor_ar?: string | null
  partner_id?: number | null
  start_date?: string | null
  end_date?: string | null
  status?: 'active' | 'completed' | 'upcoming' | null
  sector_key?: string | null
  sector_en?: string | null
  sector_ar?: string | null
  sector?: string | null
  geographic_level?: 'local' | 'national' | null
  governorates?: string[]
  target_group_en?: string | null
  target_group_ar?: string | null
  governorate_keys?: string[]
  target_genders?: ('male' | 'female')[]
  target_gender_labels?: string[]
  age_group_keys?: string[]
  geographic_level_label?: string | null
  age_groups?: string[]
  direct_beneficiaries?: number | null
  indirect_beneficiaries?: number | null
  key_results?: CmsProjectKeyResult[]
  featured_image?: string | null
  images?: string[]
  related_news_ids?: number[]
  related_publication_ids?: number[]
}

export interface CmsProjectsSectorStat {
  en: string
  ar: string
  count: number
}

export interface CmsProjectsStats {
  status: { active: number; completed: number; upcoming: number }
  sectors: Record<string, CmsProjectsSectorStat>
  geographic_level: { local: number; national: number }
  beneficiaries: {
    direct: number
    indirect: number
    gender?: { female_pct: number; male_pct: number } | null
    age?: Record<string, number> | null
  }
  governorates_covered: number
  donors_count: number
}

export interface CmsProjectsData {
  records: CmsProjectsListRecord[]
  stats: CmsProjectsStats
  config?: {
    sectors: Record<string, string>
    geographic_levels: Record<string, string>
    genders: Record<string, string>
    age_groups: Record<string, string>
    governorates: Record<string, string>
  }
}

export const getProjectsData = cache(async (locale: string): Promise<CmsProjectsData | null> => {
  return fetchCms<CmsProjectsData>(`/api/${locale}/projects`)
})

// ─────────────────────────────────────────────
// Programs & Projects listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsProjectsPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsProjectsPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ value: string; suffix?: string; label: string }>
}

export interface CmsProjectsPageDashboardSection {
  key: string
  is_visible: boolean
  widgets?: {
    status?: boolean
    sectors?: boolean
    geographic?: boolean
    gender?: boolean
    age?: boolean
    beneficiary_cards?: boolean
  }
}

export interface CmsProjectsPageGridSection {
  key: string
  is_visible: boolean
  title?: string | null
}

export interface CmsProjectsPageSections {
  hero?: CmsProjectsPageHeroSection
  stats_kpi?: { key: string; is_visible: boolean }
  dashboard?: CmsProjectsPageDashboardSection
  projects_grid?: CmsProjectsPageGridSection
}

export interface CmsProjectsPageData {
  page: CmsProjectsPageMeta
  sections: CmsProjectsPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
}

export const getProjectsPageData = cache(async (locale: string): Promise<CmsProjectsPageData | null> => {
  return fetchCms<CmsProjectsPageData>(`/api/${locale}/projects-page`)
})

// ─────────────────────────────────────────────
// Partners & Supporters listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsPartnersPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsPartnersPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ value: string; suffix?: string; label: string }>
}

export interface CmsPartnersPageListSection {
  key: string
  is_visible: boolean
  category_order?: string[]
}

export interface CmsPartnersPageSections {
  hero?: CmsPartnersPageHeroSection
  partners_list?: CmsPartnersPageListSection
}

export interface CmsPartnersPageData {
  page: CmsPartnersPageMeta
  sections: CmsPartnersPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
  config?: {
    categories: Record<string, string>
  }
}

export const getPartnersPageData = cache(async (locale: string): Promise<CmsPartnersPageData | null> => {
  return fetchCms<CmsPartnersPageData>(`/api/${locale}/partners-page`)
})

// ─────────────────────────────────────────────
// Team & Governance listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsTeamPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsTeamPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ value: string; suffix?: string; label: string }>
}

export interface CmsTeamPageGridSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  use_live_member_count?: boolean
  count_label?: string | null
}

export interface CmsTeamGovernanceBody {
  key: string
  title: string
  description: string
  member_ids: number[]
}

export interface CmsTeamOrgChart {
  title?: string | null
  leadership?: {
    badge?: string | null
    subtitle?: string | null
    title?: string | null
    person_name?: string | null
  }
  departments?: Array<{ icon: string; label: string; sub: string }>
  role_columns?: Array<{ roles: string[] }>
  support_strip?: {
    title?: string | null
    items?: Array<{ icon: string; label: string }>
  }
}

export interface CmsTeamGovernanceSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  bodies?: CmsTeamGovernanceBody[]
  org_chart?: CmsTeamOrgChart
}

export interface CmsTeamPageSections {
  hero?: CmsTeamPageHeroSection
  team_grid?: CmsTeamPageGridSection
  governance?: CmsTeamGovernanceSection
}

export interface CmsTeamPageData {
  page: CmsTeamPageMeta
  sections: CmsTeamPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
}

export const getTeamPageData = cache(async (locale: string): Promise<CmsTeamPageData | null> => {
  return fetchCms<CmsTeamPageData>(`/api/${locale}/team-page`)
})

// ─────────────────────────────────────────────
// Digital Observatory page (CMS)
// ─────────────────────────────────────────────

export interface CmsObservatoryPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsObservatoryPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_video?: string | null
}

export interface CmsObservatoryMethodologyStep {
  num?: string | null
  title?: string | null
  desc?: string | null
}

export interface CmsObservatoryClassification {
  id?: string | null
  title?: string | null
  desc?: string | null
  color?: string | null
}

export interface CmsObservatoryTextItem {
  text?: string | null
}

export interface CmsObservatoryAboutSection {
  key: string
  is_visible: boolean
  badge?: string | null
  title?: string | null
  goal_title?: string | null
  goal_text?: string | null
  role_title?: string | null
  role_text?: string | null
  methodology_title?: string | null
  methodology_steps?: CmsObservatoryMethodologyStep[]
  classifications_title?: string | null
  classifications?: CmsObservatoryClassification[]
  indicators_title?: string | null
  indicators?: CmsObservatoryTextItem[]
  disclaimer_title?: string | null
  disclaimer_items?: CmsObservatoryTextItem[]
}

export interface CmsObservatoryDashboardsSection {
  key: string
  is_visible: boolean
  badge?: string | null
  title?: string | null
  status_badge?: string | null
  platform_title?: string | null
  gender_title?: string | null
  trend_title?: string | null
  governorate_title?: string | null
  comparison_note?: string | null
}

export interface CmsObservatoryReportsSection {
  key: string
  is_visible: boolean
  badge?: string | null
  title?: string | null
}

export interface CmsObservatoryReportStep {
  title?: string | null
  desc?: string | null
}

export interface CmsObservatoryReportFormSection {
  key: string
  is_visible: boolean
  badge?: string | null
  title?: string | null
  subtitle?: string | null
  after_report_title?: string | null
  after_report_steps?: CmsObservatoryReportStep[]
  privacy_title?: string | null
  privacy_text?: string | null
}

export interface CmsObservatoryPageSections {
  hero?: CmsObservatoryPageHeroSection
  about?: CmsObservatoryAboutSection
  dashboards?: CmsObservatoryDashboardsSection
  reports?: CmsObservatoryReportsSection
  report_form?: CmsObservatoryReportFormSection
}

export interface CmsObservatoryPageData {
  page: CmsObservatoryPageMeta
  sections: CmsObservatoryPageSections
  sections_order?: string[]
}

export const getObservatoryPageData = cache(async (locale: string): Promise<CmsObservatoryPageData | null> => {
  return fetchCms<CmsObservatoryPageData>(`/api/${locale}/observatory-page`)
})

export interface ObservatoryReportSubmissionResult {
  reference_number: string
}

export interface ObservatoryReportSubmissionError {
  message: string
  errors?: Record<string, string[]>
}

export async function submitObservatoryReport(
  formData: FormData,
): Promise<{ ok: true; data: ObservatoryReportSubmissionResult } | { ok: false; error: ObservatoryReportSubmissionError }> {
  try {
    const res = await fetch(`${CMS_URL}/api/observatory-report-submissions`, {
      method: 'POST',
      body: formData,
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: typeof payload?.message === 'string' ? payload.message : 'Submission failed',
          errors: payload?.errors as Record<string, string[]> | undefined,
        },
      }
    }

    return {
      ok: true,
      data: payload as ObservatoryReportSubmissionResult,
    }
  } catch {
    return {
      ok: false,
      error: { message: 'Network error' },
    }
  }
}

// ─────────────────────────────────────────────
// Initiatives module API
// ─────────────────────────────────────────────

export interface CmsInitiativeOutput {
  en?: string | null
  ar?: string | null
}

export interface CmsInitiativeListRecord {
  id: number
  slug: string
  title_en: string
  title_ar: string
  summary_en?: string | null
  summary_ar?: string | null
  description_en?: string | null
  description_ar?: string | null
  objective_en?: string | null
  objective_ar?: string | null
  category_key?: string | null
  category_en?: string | null
  category_ar?: string | null
  category?: string | null
  outputs?: CmsInitiativeOutput[]
  reach_value?: number | null
  reach_suffix_en?: string | null
  reach_suffix_ar?: string | null
  reach_suffix?: string | null
  featured_image?: string | null
  images?: string[]
  videos?: string[]
  related_project_id?: number | null
  related_project_slug?: string | null
  start_date?: string | null
  end_date?: string | null
  is_ongoing?: boolean
}

export interface CmsInitiativesStats {
  total: number
  ongoing: number
}

export interface CmsInitiativesData {
  records: CmsInitiativeListRecord[]
  stats: CmsInitiativesStats
  config?: {
    categories: Record<string, string>
  }
}

export const getInitiativesData = cache(async (locale: string): Promise<CmsInitiativesData | null> => {
  return fetchCms<CmsInitiativesData>(`/api/${locale}/initiatives`)
})

export const getInitiativeRecordBySlug = cache(async (
  locale: string,
  slug: string,
): Promise<CmsInitiativeListRecord | null> => {
  const data = await fetchCms<{ record: CmsInitiativeListRecord }>(`/api/${locale}/initiatives/${slug}`)
  return data?.record ?? null
})

// ─────────────────────────────────────────────
// Initiatives & Campaigns listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsInitiativesPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsInitiativesPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }>
}

export interface CmsInitiativesPageSections {
  hero?: CmsInitiativesPageHeroSection
  stats_kpi?: { key: string; is_visible: boolean }
  initiatives_grid?: { key: string; is_visible: boolean; title?: string | null }
}

export interface CmsInitiativesPageData {
  page: CmsInitiativesPageMeta
  sections: CmsInitiativesPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
  config?: {
    categories: Record<string, string>
  }
}

export const getInitiativesPageData = cache(async (locale: string): Promise<CmsInitiativesPageData | null> => {
  return fetchCms<CmsInitiativesPageData>(`/api/${locale}/initiatives-page`)
})

// ─────────────────────────────────────────────
// Publications module API
// ─────────────────────────────────────────────

export interface CmsPublicationAuthor {
  en?: string | null
  ar?: string | null
}

export interface CmsPublicationTag {
  en?: string | null
  ar?: string | null
}

export interface CmsPublicationListRecord {
  id: number
  slug: string
  title_en: string
  title_ar: string
  summary_en?: string | null
  summary_ar?: string | null
  type: string
  type_label?: string | null
  publication_date?: string | null
  cover_image?: string | null
  pdf_url?: string | null
  pages?: number | null
  authors?: CmsPublicationAuthor[]
  tags?: CmsPublicationTag[]
  related_publication_ids?: number[]
  related_publication_slugs?: string[]
  is_featured?: boolean
  sort_order?: number
}

export interface CmsPublicationsStats {
  total: number
  by_type: Record<string, number>
}

export interface CmsPublicationsData {
  records: CmsPublicationListRecord[]
  stats: CmsPublicationsStats
  config?: {
    types: Record<string, string>
  }
}

export const getPublicationsData = cache(async (locale: string): Promise<CmsPublicationsData | null> => {
  return fetchCms<CmsPublicationsData>(`/api/${locale}/publications`)
})

export const getPublicationRecordBySlug = cache(async (
  locale: string,
  slug: string,
): Promise<CmsPublicationListRecord | null> => {
  const data = await fetchCms<{ record: CmsPublicationListRecord }>(`/api/${locale}/publications/${slug}`)
  return data?.record ?? null
})

// ─────────────────────────────────────────────
// Publications & Reports listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsPublicationsPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsPublicationsPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }>
}

export interface CmsPublicationsPageSections {
  hero?: CmsPublicationsPageHeroSection
  publications_grid?: { key: string; is_visible: boolean; title?: string | null }
}

export interface CmsPublicationsPageData {
  page: CmsPublicationsPageMeta
  sections: CmsPublicationsPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
  config?: {
    types: Record<string, string>
  }
}

export const getPublicationsPageData = cache(async (locale: string): Promise<CmsPublicationsPageData | null> => {
  return fetchCms<CmsPublicationsPageData>(`/api/${locale}/publications-page`)
})

// ─────────────────────────────────────────────
// Contact page API
// ─────────────────────────────────────────────

export interface CmsContactPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsContactPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
}

export interface CmsContactPageFormSection {
  key: string
  is_visible: boolean
  title?: string | null
  description?: string | null
  notification_email?: string | null
}

export interface CmsContactPageInfoSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  show_social?: boolean
  website_url?: string | null
  website_label?: string | null
}

export interface CmsContactPageMapSection {
  key: string
  is_visible: boolean
  title?: string | null
  map_embed_url?: string | null
}

export interface CmsContactPageSections {
  hero?: CmsContactPageHeroSection
  contact_form?: CmsContactPageFormSection
  contact_info?: CmsContactPageInfoSection
  map?: CmsContactPageMapSection
}

export interface CmsContactPageData {
  page: CmsContactPageMeta
  sections: CmsContactPageSections
  sections_order?: string[]
}

export const getContactPageData = cache(async (locale: string): Promise<CmsContactPageData | null> => {
  return fetchCms<CmsContactPageData>(`/api/${locale}/contact-page`)
})

export interface ContactSubmissionResult {
  reference_number: string
}

export interface ContactSubmissionError {
  message: string
  errors?: Record<string, string[]>
}

export async function submitContactForm(
  body: Record<string, string>,
): Promise<{ ok: true; data: ContactSubmissionResult } | { ok: false; error: ContactSubmissionError }> {
  try {
    const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: typeof payload?.message === 'string' ? payload.message : 'Submission failed',
          errors: payload?.errors as Record<string, string[]> | undefined,
        },
      }
    }

    return {
      ok: true,
      data: payload as ContactSubmissionResult,
    }
  } catch {
    return {
      ok: false,
      error: { message: 'Network error' },
    }
  }
}

// ─────────────────────────────────────────────
// Navigation menu API
// ─────────────────────────────────────────────

export interface CmsNavItem {
  id?: number
  label: string
  href: string
  description?: string | null
  children?: CmsNavItem[]
}

export interface CmsFooterNavSection {
  label: string
  items: Array<{ label: string; href: string }>
}

export interface CmsNavigationData {
  header: CmsNavItem[]
  footer: Record<string, CmsFooterNavSection>
  config?: {
    pages: Record<string, string>
  }
}

export const getNavigationData = cache(async (locale: string): Promise<CmsNavigationData | null> => {
  return fetchCms<CmsNavigationData>(`/api/${locale}/navigation`)
})

// ─────────────────────────────────────────────
// Join Us page API
// ─────────────────────────────────────────────

export interface CmsJoinPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsJoinPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
}

export interface CmsJoinPageFormSection {
  key: string
  is_visible: boolean
  title?: string | null
  description?: string | null
  notification_email?: string | null
}

export interface CmsJoinWhyJoinItem {
  icon?: string | null
  title?: string | null
  description?: string | null
}

export interface CmsJoinWhyJoinSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  items?: CmsJoinWhyJoinItem[]
}

export interface CmsJoinPageSections {
  hero?: CmsJoinPageHeroSection
  application_form?: CmsJoinPageFormSection
  why_join?: CmsJoinWhyJoinSection
}

export interface CmsJoinPageData {
  page: CmsJoinPageMeta
  sections: CmsJoinPageSections
  sections_order?: string[]
  config?: {
    interests: Record<string, string>
  }
}

export const getJoinPageData = cache(async (locale: string): Promise<CmsJoinPageData | null> => {
  return fetchCms<CmsJoinPageData>(`/api/${locale}/join-page`)
})

export interface JoinApplicationResult {
  reference_number: string
}

export interface JoinApplicationError {
  message: string
  errors?: Record<string, string[]>
}

export async function submitJoinApplication(
  body: Record<string, string>,
): Promise<{ ok: true; data: JoinApplicationResult } | { ok: false; error: JoinApplicationError }> {
  try {
    const res = await fetch(`${CMS_URL}/api/join-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: typeof payload?.message === 'string' ? payload.message : 'Submission failed',
          errors: payload?.errors as Record<string, string[]> | undefined,
        },
      }
    }

    return {
      ok: true,
      data: payload as JoinApplicationResult,
    }
  } catch {
    return {
      ok: false,
      error: { message: 'Network error' },
    }
  }
}

export interface NewsletterSubscriptionResult {
  reference_number: string
}

export interface NewsletterSubscriptionError {
  message: string
  errors?: Record<string, string[]>
}

export async function submitNewsletterSubscription(
  body: { locale: string; email: string },
): Promise<{ ok: true; data: NewsletterSubscriptionResult } | { ok: false; error: NewsletterSubscriptionError }> {
  try {
    const res = await fetch(`${CMS_URL}/api/newsletter-subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: typeof payload?.message === 'string' ? payload.message : 'Submission failed',
          errors: payload?.errors as Record<string, string[]> | undefined,
        },
      }
    }

    return {
      ok: true,
      data: payload as NewsletterSubscriptionResult,
    }
  } catch {
    return {
      ok: false,
      error: { message: 'Network error' },
    }
  }
}

// ─────────────────────────────────────────────
// News / Media Center module API
// ─────────────────────────────────────────────

export interface CmsNewsTag {
  en?: string | null
  ar?: string | null
}

export interface CmsNewsListRecord {
  id: number
  slug: string
  title_en: string
  title_ar: string
  summary_en?: string | null
  summary_ar?: string | null
  content_en?: string | null
  content_ar?: string | null
  category: string
  category_label?: string | null
  published_at?: string | null
  cover_image?: string | null
  author_en?: string | null
  author_ar?: string | null
  tags?: CmsNewsTag[]
  source_en?: string | null
  source_ar?: string | null
  source_url?: string | null
  embed_url?: string | null
  embed_type?: string | null
  video_url?: string | null
  duration?: string | null
  channel_en?: string | null
  channel_ar?: string | null
  related_project_slug?: string | null
  related_publication_slug?: string | null
  related_news_ids?: number[]
  related_news_slugs?: string[]
  include_same_category_related?: boolean
  external_url?: string | null
  is_featured?: boolean
  sort_order?: number
}

export interface CmsNewsStats {
  total: number
  by_category: Record<string, number>
}

export interface CmsNewsData {
  records: CmsNewsListRecord[]
  stats: CmsNewsStats
  config?: {
    categories: Record<string, string>
  }
}

export const getNewsData = cache(async (locale: string): Promise<CmsNewsData | null> => {
  return fetchCms<CmsNewsData>(`/api/${locale}/news`)
})

export const getNewsRecordBySlug = cache(async (
  locale: string,
  slug: string,
): Promise<CmsNewsListRecord | null> => {
  const data = await fetchCms<{ record: CmsNewsListRecord }>(`/api/${locale}/news/${slug}`)
  return data?.record ?? null
})

// ─────────────────────────────────────────────
// Media Center listing page (CMS)
// ─────────────────────────────────────────────

export interface CmsMediaCenterPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsMediaCenterPageHeroSection {
  key: string
  is_visible: boolean
  title?: string | null
  subtitle?: string | null
  badge?: string | null
  background_image?: string | null
  use_live_stats?: boolean
  stats?: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }>
}

export interface CmsMediaCenterPageSections {
  hero?: CmsMediaCenterPageHeroSection
  media_grid?: { key: string; is_visible: boolean; title?: string | null }
}

export interface CmsMediaCenterPageData {
  page: CmsMediaCenterPageMeta
  sections: CmsMediaCenterPageSections
  sections_order?: string[]
  sections_list?: Array<{
    key: string
    type: string
    is_visible: boolean
    data: Record<string, unknown>
  }>
  config?: {
    categories: Record<string, string>
  }
}

export const getMediaCenterPageData = cache(async (locale: string): Promise<CmsMediaCenterPageData | null> => {
  return fetchCms<CmsMediaCenterPageData>(`/api/${locale}/media-center-page`)
})

// ─────────────────────────────────────────────
// About page (CMS)
// ─────────────────────────────────────────────

export interface CmsAboutPageMeta {
  key: string
  seo_title?: string | null
  seo_description?: string | null
  is_indexed: boolean
  updated_at?: string
}

export interface CmsAboutValue {
  id?: string | null
  title?: string | null
  description?: string | null
}

export interface CmsAboutPolicy {
  title?: string | null
  url?: string | null
}

export interface CmsAboutPolicyGroup {
  title?: string | null
  policies?: CmsAboutPolicy[]
}

export interface CmsAboutPageSections {
  hero?: {
    key: string
    is_visible: boolean
    title?: string | null
    badge?: string | null
    background_image?: string | null
  }
  overview?: {
    key: string
    is_visible: boolean
    title?: string | null
    description?: string | null
  }
  who_we_are?: {
    key: string
    is_visible: boolean
    title?: string | null
    vision?: string | null
    mission?: string | null
    values?: CmsAboutValue[]
  }
  team_overview?: {
    key: string
    is_visible: boolean
    title?: string | null
    subtitle?: string | null
    preview_count?: number
    view_all?: { label?: string | null; url?: string | null }
  }
  partners_overview?: {
    key: string
    is_visible: boolean
    title?: string | null
    subtitle?: string | null
    preview_count?: number
    view_all?: { label?: string | null; url?: string | null }
  }
  governance?: {
    key: string
    is_visible: boolean
    title?: string | null
    intro?: string | null
    policy_groups?: CmsAboutPolicyGroup[]
  }
}

export interface CmsAboutPageData {
  page: CmsAboutPageMeta
  sections: CmsAboutPageSections
  sections_order?: string[]
}

export interface CmsTeamMemberRecord {
  id: number
  slug: string
  name_en: string
  name_ar: string
  position_en: string
  position_ar: string
  department_en?: string | null
  department_ar?: string | null
  bio_en?: string | null
  bio_ar?: string | null
  email?: string | null
  linkedin?: string | null
  photo?: string | null
  sort_order?: number
}

export interface CmsTeamData {
  records: CmsTeamMemberRecord[]
}

export const getAboutPageData = cache(async (locale: string): Promise<CmsAboutPageData | null> => {
  return fetchCms<CmsAboutPageData>(`/api/${locale}/about-page`)
})

export const getTeamData = cache(async (locale: string): Promise<CmsTeamData | null> => {
  return fetchCms<CmsTeamData>(`/api/${locale}/team`)
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
