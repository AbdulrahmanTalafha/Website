import type { MetadataRoute } from 'next'
import { projectsData } from '@/data/projects'
import { publicationsData } from '@/data/publications'
import { newsData } from '@/data/media'
import { initiativesData } from '@/data/initiatives'
import { teamData } from '@/data/team'
import { getHomeData, getPublicationsData } from '@/lib/cms'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://werise.org.jo'
const locales = ['ar', 'en'] as const

function isHomeIndexed(
  locale: string,
  homeByLocale: Record<string, Awaited<ReturnType<typeof getHomeData>>>,
): boolean {
  const home = homeByLocale[locale]
  // CMS unavailable — keep legacy static sitemap behavior (include home).
  if (!home?.page) return true
  return home.page.is_indexed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homeEn, homeAr] = await Promise.all([
    getHomeData('en'),
    getHomeData('ar'),
  ])
  const homeByLocale = { en: homeEn, ar: homeAr }

  const staticPages = [
    '',
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

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages
      .filter((path) => path !== '' || isHomeIndexed(locale, homeByLocale))
      .map((path) => ({
        url: `${BASE}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ar: `${BASE}/ar${path}`,
            en: `${BASE}/en${path}`,
          },
        },
      })),
  )

  const projectEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    projectsData.map(p => ({
      url: `${BASE}/${locale}/programs-projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${BASE}/ar/programs-projects/${p.slug}`,
          en: `${BASE}/en/programs-projects/${p.slug}`,
        },
      },
    }))
  )

  const publicationSlugs = await (async () => {
    const cms = await getPublicationsData('en')
    if (cms?.records?.length) return cms.records.map((p) => p.slug)
    return publicationsData.map((p) => p.slug)
  })()

  const publicationEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    publicationSlugs.map(slug => ({
      url: `${BASE}/${locale}/publications-reports/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${BASE}/ar/publications-reports/${slug}`,
          en: `${BASE}/en/publications-reports/${slug}`,
        },
      },
    }))
  )

  const newsEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    newsData.map(n => ({
      url: `${BASE}/${locale}/media-center/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          ar: `${BASE}/ar/media-center/${n.slug}`,
          en: `${BASE}/en/media-center/${n.slug}`,
        },
      },
    }))
  )

  const initiativeEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    initiativesData.map(i => ({
      url: `${BASE}/${locale}/initiatives-campaigns/${i.slug}`,
      lastModified: i.endDate ? new Date(i.endDate) : new Date(i.startDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${BASE}/ar/initiatives-campaigns/${i.slug}`,
          en: `${BASE}/en/initiatives-campaigns/${i.slug}`,
        },
      },
    }))
  )

  const teamEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    teamData.map(member => ({
      url: `${BASE}/${locale}/team-governance/${member.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          ar: `${BASE}/ar/team-governance/${member.slug}`,
          en: `${BASE}/en/team-governance/${member.slug}`,
        },
      },
    }))
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
