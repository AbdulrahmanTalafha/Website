import type { Locale } from '@/types'
import type { Project, Publication, NewsItem, Initiative, TeamMember, ObservatoryStats, ObservatoryReport, Election, Partner } from '@/types'

// Import static data
import { projectsData } from '@/data/projects'
import { publicationsData } from '@/data/publications'
import { newsData } from '@/data/media'
import { initiativesData } from '@/data/initiatives'
import { teamData } from '@/data/team'
import { observatoryStats, observatoryReports } from '@/data/observatory'
import { electionsData } from '@/data/elections'
import { partnersData } from '@/data/partners'
import { homeData } from '@/data/home'
import { aboutData } from '@/data/about'
import { getPartnersData } from '@/lib/cms'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { staticPartnerLogoByNameEn } from '@/lib/partnerLogos'
import type { PartnerCategory } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: All functions below currently return static mock data.
// To connect a real API/CMS, replace the return statement in each function
// with an actual fetch() call to your backend or CMS API endpoint.
// All functions are async to make that future replacement seamless.
// Example:
//   const res = await fetch(`${process.env.API_URL}/projects?locale=${locale}`)
//   const data = await res.json()
//   return data
// ─────────────────────────────────────────────────────────────────────────────

export async function getHomePage(locale: Locale) {
  // TODO: Replace with API call: GET /api/home?locale={locale}
  return homeData
}

export async function getAboutPage(locale: Locale) {
  // TODO: Replace with API call: GET /api/about?locale={locale}
  return aboutData
}

export async function getProjects(locale: Locale, filters?: {
  year?: string
  sector?: string
  governorate?: string
  donor?: string
}): Promise<Project[]> {
  // TODO: Replace with API call: GET /api/projects?locale={locale}&filters
  let projects = [...projectsData]
  if (filters?.year) {
    projects = projects.filter(p => p.startDate.startsWith(filters.year!))
  }
  if (filters?.sector) {
    projects = projects.filter(p => p.sectorKey === filters.sector)
  }
  if (filters?.governorate) {
    projects = projects.filter(p => p.governorates.includes(filters.governorate!))
  }
  return projects
}

export async function getProjectBySlug(locale: Locale, slug: string): Promise<Project | null> {
  // TODO: Replace with API call: GET /api/projects/{slug}?locale={locale}
  return projectsData.find(p => p.slug === slug) ?? null
}

export async function getPublications(locale: Locale, filters?: {
  year?: string
  topic?: string
  type?: string
}): Promise<Publication[]> {
  // TODO: Replace with API call: GET /api/publications?locale={locale}&filters
  let pubs = [...publicationsData]
  if (filters?.type) {
    pubs = pubs.filter(p => p.type === filters.type)
  }
  if (filters?.year) {
    pubs = pubs.filter(p => p.publishDate.startsWith(filters.year!))
  }
  return pubs
}

export async function getPublicationBySlug(locale: Locale, slug: string): Promise<Publication | null> {
  // TODO: Replace with API call: GET /api/publications/{slug}?locale={locale}
  return publicationsData.find(p => p.slug === slug) ?? null
}

export async function getNews(locale: Locale, category?: string): Promise<NewsItem[]> {
  // TODO: Replace with API call: GET /api/news?locale={locale}&category={category}
  if (category) return newsData.filter(n => n.category === category)
  return newsData
}

export async function getNewsBySlug(locale: Locale, slug: string): Promise<NewsItem | null> {
  // TODO: Replace with API call: GET /api/news/{slug}?locale={locale}
  return newsData.find(n => n.slug === slug) ?? null
}

export async function getInitiatives(locale: Locale, category?: string): Promise<Initiative[]> {
  // TODO: Replace with API call: GET /api/initiatives?locale={locale}
  if (category) return initiativesData.filter(i => i.category === category)
  return initiativesData
}

export async function getInitiativeBySlug(locale: Locale, slug: string): Promise<Initiative | null> {
  // TODO: Replace with API call: GET /api/initiatives/{slug}?locale={locale}
  return initiativesData.find(i => i.slug === slug) ?? null
}

export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  // TODO: Replace with API call: GET /api/team?locale={locale}
  return teamData.sort((a, b) => a.order - b.order)
}

export async function getObservatoryData(locale: Locale): Promise<{
  stats: ObservatoryStats
  reports: ObservatoryReport[]
}> {
  // TODO: Replace with API call: GET /api/observatory?locale={locale}
  return { stats: observatoryStats, reports: observatoryReports }
}

export async function getElections(locale: Locale): Promise<Election[]> {
  // TODO: Replace with API call: GET /api/elections?locale={locale}
  return electionsData
}

export async function getPartners(locale: Locale): Promise<Partner[]> {
  const cms = await getPartnersData(locale)

  if (!cms?.records?.length) {
    return partnersData
  }

  return cms.records.map((partner) => ({
    id: String(partner.id),
    name: { ar: partner.name_ar, en: partner.name_en },
    description: partner.description_en || partner.description_ar
      ? { ar: partner.description_ar ?? '', en: partner.description_en ?? '' }
      : undefined,
    logo: resolveCmsMediaUrl(
      partner.logo,
      staticPartnerLogoByNameEn(partner.name_en, partnersData),
      `https://picsum.photos/seed/partner-${partner.id}/200/80`,
    ),
    website: partner.website_url ?? undefined,
    category: partner.category as PartnerCategory,
  }))
}

export async function searchContent(locale: Locale, query: string) {
  // TODO: Replace with API call: GET /api/search?q={query}&locale={locale}
  const q = query.toLowerCase()
  const projects = projectsData
    .filter(p => p.title[locale].toLowerCase().includes(q) || p.shortDescription[locale].toLowerCase().includes(q))
    .map(p => ({ id: p.id, type: 'project' as const, title: p.title[locale], excerpt: p.shortDescription[locale], slug: p.slug, image: p.featuredImage }))

  const publications = publicationsData
    .filter(p => p.title[locale].toLowerCase().includes(q) || p.summary[locale].toLowerCase().includes(q))
    .map(p => ({ id: p.id, type: 'publication' as const, title: p.title[locale], excerpt: p.summary[locale], slug: p.slug, date: p.publishDate, image: p.coverImage }))

  const news = newsData
    .filter(n => n.title[locale].toLowerCase().includes(q) || n.excerpt[locale].toLowerCase().includes(q))
    .map(n => ({ id: n.id, type: 'news' as const, title: n.title[locale], excerpt: n.excerpt[locale], slug: n.slug, date: n.date, image: n.image }))

  const initiatives = initiativesData
    .filter(i => i.title[locale].toLowerCase().includes(q) || i.shortDescription[locale].toLowerCase().includes(q))
    .map(i => ({ id: i.id, type: 'initiative' as const, title: i.title[locale], excerpt: i.shortDescription[locale], slug: i.slug, image: i.featuredImage }))

  return { projects, publications, news, initiatives }
}
