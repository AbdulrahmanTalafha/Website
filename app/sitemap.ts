import type { MetadataRoute } from 'next'
import { projectsData } from '@/data/projects'
import { publicationsData } from '@/data/publications'
import { newsData } from '@/data/media'
import { initiativesData } from '@/data/initiatives'
import { teamData } from '@/data/team'
import {
  getHomeData,
  getJoinPageData,
  getPublicationsData,
  getNewsData,
  getProjectsData,
  getInitiativesData,
  getTeamData,
} from '@/lib/cms'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://werise.org.jo'
const locales = ['ar', 'en'] as const

type LocaleKey = typeof locales[number]

function isHomeIndexed(
  locale: string,
  homeByLocale: Record<string, Awaited<ReturnType<typeof getHomeData>>>,
): boolean {
  const home = homeByLocale[locale]
  if (!home?.page) return true
  return home.page.is_indexed
}

function isJoinIndexed(
  locale: string,
  joinByLocale: Record<string, Awaited<ReturnType<typeof getJoinPageData>>>,
): boolean {
  const join = joinByLocale[locale]
  if (!join?.page) return true
  return join.page.is_indexed
}

function localeEntry(
  locale: LocaleKey,
  path: string,
  opts?: {
    lastModified?: Date
    changeFrequency?: 'weekly' | 'monthly'
    priority?: number
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}/${locale}${path}`,
    lastModified: opts?.lastModified ?? new Date(),
    changeFrequency: opts?.changeFrequency ?? 'weekly',
    priority: opts?.priority ?? 0.8,
    alternates: {
      languages: {
        ar: `${BASE}/ar${path}`,
        en: `${BASE}/en${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homeEn, homeAr, joinEn, joinAr] = await Promise.all([
    getHomeData('en'),
    getHomeData('ar'),
    getJoinPageData('en'),
    getJoinPageData('ar'),
  ])
  const homeByLocale = { en: homeEn, ar: homeAr }
  const joinByLocale = { en: joinEn, ar: joinAr }

  const staticPages = [
    '/about',
    '/team-governance',
    '/programs-projects',
    '/initiatives-campaigns',
    '/publications-reports',
    '/digital-observatory',
    '/e-election-platform',
    '/media-center',
    '/partners-supporters',
    '/contact',
  ]

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const entries: MetadataRoute.Sitemap = []

    if (isHomeIndexed(locale, homeByLocale)) {
      entries.push(localeEntry(locale, '', { priority: 1.0 }))
    }

    for (const path of staticPages) {
      entries.push(localeEntry(locale, path))
    }

    if (isJoinIndexed(locale, joinByLocale)) {
      entries.push(localeEntry(locale, '/join-us'))
    }

    return entries
  })

  const projectSlugs = await (async () => {
    const cms = await getProjectsData('en')
    if (cms?.records?.length) {
      return cms.records.map((record) => ({
        slug: record.slug,
        lastModified: record.start_date ? new Date(record.start_date) : new Date(),
      }))
    }

    return projectsData.map((project) => ({
      slug: project.slug,
      lastModified: project.startDate ? new Date(project.startDate) : new Date(),
    }))
  })()

  const projectEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    projectSlugs.map((project) =>
      localeEntry(locale, `/programs-projects/${project.slug}`, {
        lastModified: project.lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      }),
    ),
  )

  const publicationSlugs = await (async () => {
    const cms = await getPublicationsData('en')
    if (cms?.records?.length) {
      return cms.records.map((record) => ({
        slug: record.slug,
        lastModified: record.publication_date
          ? new Date(record.publication_date)
          : new Date(),
      }))
    }

    return publicationsData.map((publication) => ({
      slug: publication.slug,
      lastModified: new Date(publication.publishDate),
    }))
  })()

  const publicationEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    publicationSlugs.map((publication) =>
      localeEntry(locale, `/publications-reports/${publication.slug}`, {
        lastModified: publication.lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      }),
    ),
  )

  const newsItems = await (async () => {
    const cms = await getNewsData('en')
    if (cms?.records?.length) {
      return cms.records.map((record) => ({
        slug: record.slug,
        lastModified: record.published_at ? new Date(record.published_at) : new Date(),
      }))
    }

    return newsData.map((item) => ({
      slug: item.slug,
      lastModified: new Date(item.date),
    }))
  })()

  const newsEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    newsItems.map((item) =>
      localeEntry(locale, `/media-center/${item.slug}`, {
        lastModified: item.lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      }),
    ),
  )

  const initiativeSlugs = await (async () => {
    const cms = await getInitiativesData('en')
    if (cms?.records?.length) {
      return cms.records.map((record) => ({
        slug: record.slug,
        lastModified: record.end_date
          ? new Date(record.end_date)
          : record.start_date
            ? new Date(record.start_date)
            : new Date(),
      }))
    }

    return initiativesData.map((initiative) => ({
      slug: initiative.slug,
      lastModified: initiative.endDate
        ? new Date(initiative.endDate)
        : new Date(initiative.startDate),
    }))
  })()

  const initiativeEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    initiativeSlugs.map((initiative) =>
      localeEntry(locale, `/initiatives-campaigns/${initiative.slug}`, {
        lastModified: initiative.lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      }),
    ),
  )

  const teamSlugs = await (async () => {
    const cms = await getTeamData('en')
    if (cms?.records?.length) {
      return cms.records.map((record) => record.slug)
    }

    return teamData.map((member) => member.slug)
  })()

  const teamEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    teamSlugs.map((slug) =>
      localeEntry(locale, `/team-governance/${slug}`, {
        changeFrequency: 'monthly',
        priority: 0.5,
      }),
    ),
  )

  return [
    ...staticEntries,
    ...projectEntries,
    ...publicationEntries,
    ...newsEntries,
    ...initiativeEntries,
    ...teamEntries,
  ]
}
