import type { Locale, MediaCategory, NewsItem } from '@/types'
import { cmsAbsoluteMediaUrl, resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'
import type { CmsNewsListRecord } from '@/lib/cms'

function cmsText(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ?? ''
}

function mapTags(tags: CmsNewsListRecord['tags']): Array<Record<Locale, string>> {
  return (tags ?? []).map((tag) => ({
    en: tag.en ?? '',
    ar: tag.ar ?? '',
  }))
}

function resolveEmbedType(value: string | null | undefined): NewsItem['embedType'] | undefined {
  if (!value) return undefined
  const allowed: NewsItem['embedType'][] = ['youtube', 'facebook', 'instagram', 'twitter']
  return allowed.includes(value as NewsItem['embedType'])
    ? (value as NewsItem['embedType'])
    : undefined
}

export function mapCmsNewsToNewsItem(record: CmsNewsListRecord): NewsItem {
  const placeholder = placeholderPhotoUrl(`news-${record.slug}`, 800, 500)

  const item: NewsItem = {
    id: String(record.id),
    slug: record.slug,
    title: { ar: record.title_ar, en: record.title_en },
    excerpt: {
      ar: cmsText(record.summary_ar),
      en: cmsText(record.summary_en),
    },
    content: {
      ar: record.content_ar ?? '',
      en: record.content_en ?? '',
    },
    date: record.published_at ?? new Date().toISOString().split('T')[0],
    image: resolveCmsMediaUrl(record.cover_image, undefined, placeholder),
    category: (record.category ?? 'news') as MediaCategory,
    tags: mapTags(record.tags),
    featured: record.is_featured ?? undefined,
  }

  if (record.author_en || record.author_ar) {
    item.author = { en: record.author_en ?? '', ar: record.author_ar ?? '' }
  }

  if (record.source_en || record.source_ar) {
    item.source = { en: record.source_en ?? '', ar: record.source_ar ?? '' }
  }

  if (record.source_url) {
    item.sourceUrl = record.source_url
  }

  if (record.embed_url) {
    item.embedUrl = record.embed_url
  }

  const embedType = resolveEmbedType(record.embed_type)
  if (embedType) {
    item.embedType = embedType
  }

  if (record.video_url) {
    item.videoUrl = cmsAbsoluteMediaUrl(record.video_url) ?? record.video_url
  }

  if (record.duration) {
    item.duration = record.duration
  }

  if (record.channel_en || record.channel_ar) {
    item.channel = { en: record.channel_en ?? '', ar: record.channel_ar ?? '' }
  }

  if (record.related_project_slug) {
    item.relatedProject = record.related_project_slug
  }

  if (record.related_publication_slug) {
    item.relatedPublication = record.related_publication_slug
  }

  if (record.related_news_slugs?.length) {
    item.relatedNews = [...record.related_news_slugs]
  }

  if (record.include_same_category_related !== undefined) {
    item.includeSameCategoryRelated = record.include_same_category_related
  }

  return item
}
