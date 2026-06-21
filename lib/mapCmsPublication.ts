import type { Locale, Publication, PublicationType } from '@/types'
import { cmsAbsoluteMediaUrl, resolveCmsMediaUrl } from '@/lib/cmsMedia'
import type { CmsPublicationListRecord } from '@/lib/cms'

function cmsSummary(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ?? ''
}

function mapAuthors(authors: CmsPublicationListRecord['authors']): Array<Record<Locale, string>> {
  return (authors ?? []).map((author) => ({
    en: author.en ?? '',
    ar: author.ar ?? '',
  }))
}

function mapTags(tags: CmsPublicationListRecord['tags']): Array<Record<Locale, string>> {
  return (tags ?? []).map((tag) => ({
    en: tag.en ?? '',
    ar: tag.ar ?? '',
  }))
}

function resolvePdfUrl(url: string | null | undefined): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const absolute = cmsAbsoluteMediaUrl(trimmed)
  return absolute ?? trimmed
}

export function mapCmsPublicationToPublication(record: CmsPublicationListRecord): Publication {
  const placeholder = `https://picsum.photos/seed/pub-${record.slug}/400/560`

  return {
    id: String(record.id),
    slug: record.slug,
    title: { ar: record.title_ar, en: record.title_en },
    summary: {
      ar: cmsSummary(record.summary_ar),
      en: cmsSummary(record.summary_en),
    },
    coverImage: resolveCmsMediaUrl(record.cover_image, undefined, placeholder),
    publishDate: record.publication_date ?? new Date().toISOString().split('T')[0],
    type: (record.type ?? 'report') as PublicationType,
    tags: mapTags(record.tags),
    pdfUrl: resolvePdfUrl(record.pdf_url),
    pages: record.pages ?? undefined,
    authors: mapAuthors(record.authors).length > 0 ? mapAuthors(record.authors) : undefined,
    relatedMaterials: record.related_publication_slugs?.length
      ? [...record.related_publication_slugs]
      : undefined,
  }
}
