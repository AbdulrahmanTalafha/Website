import type { MetadataRoute } from 'next'
import { projectsData } from '@/data/projects'
import { publicationsData } from '@/data/publications'
import { newsData } from '@/data/media'
import { initiativesData } from '@/data/initiatives'
import { teamData } from '@/data/team'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://werise.org.jo'
const locales = ['ar', 'en']

export default function sitemap(): MetadataRoute.Sitemap {
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

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    staticPages.map(path => ({
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
    }))
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

  const publicationEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    publicationsData.map(p => ({
      url: `${BASE}/${locale}/publications-reports/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${BASE}/ar/publications-reports/${p.slug}`,
          en: `${BASE}/en/publications-reports/${p.slug}`,
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
