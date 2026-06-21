import type { Locale } from '@/types'
import type { ResolvedSiteSettings } from '@/lib/siteSettings'
import { buildMetadata } from '@/lib/seo'

type PageSeoInput = {
  locale: Locale
  canonicalPath: string
  title: string
  description: string
  noIndex?: boolean
  ogType?: 'website' | 'article'
  absoluteTitle?: boolean
  ogImage?: string
}

/**
 * Build page metadata with CMS general settings (site name, default OG image).
 */
export function buildCmsPageMetadata(
  site: ResolvedSiteSettings,
  opts: PageSeoInput,
) {
  return buildMetadata({
    locale: opts.locale,
    canonicalPath: opts.canonicalPath,
    customTitle: opts.title,
    customDescription: opts.description,
    noIndex: opts.noIndex,
    ogType: opts.ogType,
    absoluteTitle: opts.absoluteTitle,
    ogImage: opts.ogImage ?? site.seo.defaultImage,
    siteName: site.name,
  })
}
