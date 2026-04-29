import type { MetadataRoute } from 'next'
import { projectsData } from '@/data/projects'
import { publicationsData } from '@/data/publications'
import { newsData } from '@/data/media'

const BASE = 'https://werise.org.jo'
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
    '/search',
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
    }))
  )

  const publicationEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    publicationsData.map(p => ({
      url: `${BASE}/${locale}/publications-reports/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const newsEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    newsData.map(n => ({
      url: `${BASE}/${locale}/media-center/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...projectEntries, ...publicationEntries, ...newsEntries]
}
