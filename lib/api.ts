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
import { getInitiativesData, getInitiativeRecordBySlug, getPartnersData, getProjectsData, getPublicationsData, getPublicationRecordBySlug, getNewsData, getNewsRecordBySlug, getTeamData } from '@/lib/cms'
import { mapCmsInitiativeToInitiative } from '@/lib/mapCmsInitiative'
import { mapCmsPublicationToPublication } from '@/lib/mapCmsPublication'
import { mapCmsNewsToNewsItem } from '@/lib/mapCmsNews'
import { mapCmsTeamMemberToTeamMember } from '@/lib/mapCmsTeamMember'
import { mapCmsProjectToProject, projectMatchesGovernorate } from '@/lib/mapCmsProject'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl, rewriteLegacyImageUrl } from '@/lib/placeholderImages'
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

function normalizeNewsItem(item: NewsItem): NewsItem {
  return { ...item, image: rewriteLegacyImageUrl(item.image) }
}

function normalizeProject(item: Project): Project {
  return {
    ...item,
    featuredImage: rewriteLegacyImageUrl(item.featuredImage),
    images: item.images.map(rewriteLegacyImageUrl),
  }
}

function normalizePublication(item: Publication): Publication {
  return { ...item, coverImage: rewriteLegacyImageUrl(item.coverImage) }
}

function normalizeInitiative(item: Initiative): Initiative {
  return {
    ...item,
    featuredImage: rewriteLegacyImageUrl(item.featuredImage),
    images: item.images.map(rewriteLegacyImageUrl),
  }
}

function normalizeTeamMember(item: TeamMember): TeamMember {
  return { ...item, photo: rewriteLegacyImageUrl(item.photo) }
}

function normalizePartner(item: Partner): Partner {
  return {
    ...item,
    logo: item.logo ? rewriteLegacyImageUrl(item.logo) : item.logo,
  }
}

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
  const cms = await getProjectsData(locale)

  let projects = cms?.records?.length
    ? cms.records.map(mapCmsProjectToProject)
    : projectsData.map(normalizeProject)

  if (filters?.year) {
    projects = projects.filter(p => p.startDate.startsWith(filters.year!))
  }
  if (filters?.sector) {
    projects = projects.filter(p => p.sectorKey === filters.sector)
  }
  if (filters?.governorate) {
    projects = projects.filter((p) => projectMatchesGovernorate(p, filters.governorate!))
  }
  if (filters?.donor) {
    projects = projects.filter(p => p.donor[locale] === filters.donor)
  }

  return projects
}

export async function getProjectsStats(locale: Locale) {
  const cms = await getProjectsData(locale)
  if (cms?.stats) return cms.stats

  const projects = await getProjects(locale)
  const status = { active: 0, completed: 0, upcoming: 0 }
  const sectors: Record<string, { en: string; ar: string; count: number }> = {
    'political-empowerment': { en: 'Political Empowerment', ar: 'التمكين السياسي', count: 0 },
    'economic-empowerment': { en: 'Economic Empowerment', ar: 'التمكين الاقتصادي', count: 0 },
    'digital-media': { en: 'Digital Media', ar: 'الإعلام الرقمي', count: 0 },
  }
  const geographic = { local: 0, national: 0 }
  let direct = 0
  let indirect = 0

  for (const p of projects) {
    if (p.status in status) status[p.status as keyof typeof status]++
    if (p.sectorKey in sectors) sectors[p.sectorKey].count++
    if (p.geographicLevel && p.geographicLevel in geographic) geographic[p.geographicLevel]++
    direct += p.directBeneficiaries ?? 0
    indirect += p.indirectBeneficiaries ?? 0
  }

  return {
    status,
    sectors,
    geographic_level: geographic,
    beneficiaries: { direct, indirect, gender: null, age: null },
    governorates_covered: new Set(projects.flatMap(p => p.governorates)).size,
    donors_count: new Set(projects.map(p => p.donor.en)).size,
  }
}

export async function getProjectsConfig(locale: Locale) {
  const cms = await getProjectsData(locale)

  return cms?.config ?? null
}

export async function getProjectBySlug(locale: Locale, slug: string): Promise<Project | null> {
  const cms = await getProjectsData(locale)
  const record = cms?.records?.find(p => p.slug === slug)
  if (record) return mapCmsProjectToProject(record)

  const staticProject = projectsData.find(p => p.slug === slug)
  return staticProject ? normalizeProject(staticProject) : null
}

export async function getPublications(locale: Locale, filters?: {
  year?: string
  topic?: string
  type?: string
}): Promise<Publication[]> {
  const cms = await getPublicationsData(locale)

  let pubs = cms?.records?.length
    ? cms.records.map(mapCmsPublicationToPublication)
    : publicationsData.map(normalizePublication)

  if (filters?.type) {
    pubs = pubs.filter(p => p.type === filters.type)
  }
  if (filters?.year) {
    pubs = pubs.filter(p => p.publishDate.startsWith(filters.year!))
  }
  if (filters?.topic) {
    pubs = pubs.filter(p => p.tags.some(t => t[locale] === filters.topic))
  }

  return pubs
}

export async function getPublicationsStats(locale: Locale) {
  const cms = await getPublicationsData(locale)
  if (cms?.stats) return cms.stats

  const publications = await getPublications(locale)
  const byType: Record<string, number> = {}
  for (const pub of publications) {
    byType[pub.type] = (byType[pub.type] ?? 0) + 1
  }

  return { total: publications.length, by_type: byType }
}

export async function getPublicationBySlug(locale: Locale, slug: string): Promise<Publication | null> {
  const detailRecord = await getPublicationRecordBySlug(locale, slug)
  if (detailRecord) return mapCmsPublicationToPublication(detailRecord)

  const cms = await getPublicationsData(locale)
  if (cms?.records?.length) {
    const record = cms.records.find((item) => item.slug === slug)
    if (record) return mapCmsPublicationToPublication(record)
  }

  const staticPub = publicationsData.find(p => p.slug === slug)
  return staticPub ? normalizePublication(staticPub) : null
}

export async function getNews(locale: Locale, category?: string): Promise<NewsItem[]> {
  const cms = await getNewsData(locale)

  let items = cms?.records?.length
    ? cms.records.map(mapCmsNewsToNewsItem)
    : newsData.map(normalizeNewsItem)

  if (category) {
    items = items.filter(n => n.category === category)
  }

  return items
}

export async function getNewsStats(locale: Locale) {
  const cms = await getNewsData(locale)
  if (cms?.stats) return cms.stats

  const items = await getNews(locale)
  const byCategory: Record<string, number> = {}
  for (const item of items) {
    byCategory[item.category] = (byCategory[item.category] ?? 0) + 1
  }

  return { total: items.length, by_category: byCategory }
}

export async function getNewsBySlug(locale: Locale, slug: string): Promise<NewsItem | null> {
  const detailRecord = await getNewsRecordBySlug(locale, slug)
  if (detailRecord) return mapCmsNewsToNewsItem(detailRecord)

  const cms = await getNewsData(locale)
  if (cms?.records?.length) {
    const record = cms.records.find((item) => item.slug === slug)
    if (record) return mapCmsNewsToNewsItem(record)
  }

  const staticNews = newsData.find(n => n.slug === slug)
  return staticNews ? normalizeNewsItem(staticNews) : null
}

export async function getInitiatives(locale: Locale, category?: string): Promise<Initiative[]> {
  const cms = await getInitiativesData(locale)

  if (!cms?.records?.length) {
    const items = category
      ? initiativesData.filter(i => i.category === category)
      : initiativesData
    return items.map(normalizeInitiative)
  }

  const initiatives = cms.records.map(mapCmsInitiativeToInitiative)
  if (category) return initiatives.filter(i => i.category === category)

  return initiatives
}

export async function getInitiativesStats(locale: Locale) {
  const cms = await getInitiativesData(locale)
  if (cms?.stats) return cms.stats

  const initiatives = await getInitiatives(locale)
  const ongoing = initiatives.filter(i => !i.endDate || new Date(i.endDate) >= new Date()).length

  return { total: initiatives.length, ongoing }
}

export async function getInitiativeBySlug(locale: Locale, slug: string): Promise<Initiative | null> {
  const detailRecord = await getInitiativeRecordBySlug(locale, slug)
  if (detailRecord) return mapCmsInitiativeToInitiative(detailRecord)

  const cms = await getInitiativesData(locale)
  if (cms?.records?.length) {
    const record = cms.records.find((item) => item.slug === slug)
    if (record) return mapCmsInitiativeToInitiative(record)
  }

  const staticInitiative = initiativesData.find(i => i.slug === slug)
  return staticInitiative ? normalizeInitiative(staticInitiative) : null
}

export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  const cms = await getTeamData(locale)

  if (cms?.records?.length) {
    return cms.records.map(mapCmsTeamMemberToTeamMember)
  }

  return teamData.map(normalizeTeamMember).sort((a, b) => a.order - b.order)
}

export async function getObservatoryData(locale: Locale): Promise<{
  stats: ObservatoryStats
  reports: ObservatoryReport[]
}> {
  // TODO: Replace with API call: GET /api/observatory?locale={locale}
  return {
    stats: observatoryStats,
    reports: observatoryReports.map((report) => ({
      ...report,
      coverImage: rewriteLegacyImageUrl(report.coverImage),
    })),
  }
}

export async function getElections(locale: Locale): Promise<Election[]> {
  // TODO: Replace with API call: GET /api/elections?locale={locale}
  return electionsData.map((election) => ({
    ...election,
    image: rewriteLegacyImageUrl(election.image),
  }))
}

export async function getPartners(locale: Locale): Promise<Partner[]> {
  const cms = await getPartnersData(locale)

  if (!cms?.records?.length) {
    return partnersData.map(normalizePartner)
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
      placeholderPhotoUrl(`partner-${partner.id}`, 200, 80),
    ),
    website: partner.website_url ?? undefined,
    category: partner.category as PartnerCategory,
  }))
}

export async function searchContent(locale: Locale, query: string) {
  const { fetchSiteSearch } = await import('@/lib/search')
  const data = await fetchSiteSearch(locale, query, 12)

  if (data) {
    const find = (type: string) => data.groups.find((g) => g.type === type)?.items ?? []
    return {
      projects: find('projects').map((i) => ({
        id: i.id,
        type: 'project' as const,
        title: i.title,
        excerpt: i.excerpt,
        slug: i.slug ?? '',
        image: i.image ?? undefined,
      })),
      publications: find('publications').map((i) => ({
        id: i.id,
        type: 'publication' as const,
        title: i.title,
        excerpt: i.excerpt,
        slug: i.slug ?? '',
        date: i.date ?? undefined,
        image: i.image ?? undefined,
      })),
      news: find('news').map((i) => ({
        id: i.id,
        type: 'news' as const,
        title: i.title,
        excerpt: i.excerpt,
        slug: i.slug ?? '',
        date: i.date ?? undefined,
        image: i.image ?? undefined,
      })),
      initiatives: find('initiatives').map((i) => ({
        id: i.id,
        type: 'initiative' as const,
        title: i.title,
        excerpt: i.excerpt,
        slug: i.slug ?? '',
        image: i.image ?? undefined,
      })),
    }
  }

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
