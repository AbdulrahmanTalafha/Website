import type { NewsItem } from '@/types'

const MAX_RELATED = 6

/**
 * Resolves sidebar related content for a media item.
 * 1. Manual picks (CMS related_news_slugs), in editor order
 * 2. If includeSameCategoryRelated: append same-category items (list order), excluding duplicates
 */
export function resolveRelatedNews(current: NewsItem, allNews: NewsItem[]): NewsItem[] {
  const seen = new Set<string>([current.id])
  const related: NewsItem[] = []

  for (const slug of current.relatedNews ?? []) {
    const item = allNews.find((n) => n.slug === slug)
    if (item && !seen.has(item.id)) {
      related.push(item)
      seen.add(item.id)
    }
  }

  if (current.includeSameCategoryRelated) {
    for (const item of allNews) {
      if (related.length >= MAX_RELATED) break
      if (item.category === current.category && !seen.has(item.id)) {
        related.push(item)
        seen.add(item.id)
      }
    }
  }

  return related
}
