import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getNewsBySlug, getNews, getProjectBySlug, getPublicationBySlug } from '@/lib/api'
import { getNewsData, getMediaCenterPageData } from '@/lib/cms'
import { cmsConnected } from '@/lib/cmsHomeContent'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import { newsData } from '@/data/media'
import { resolveRelatedNews } from '@/lib/resolveRelatedNews'
import CmsRichText from '@/components/common/CmsRichText'
import {
  CalendarDays, User, Tag, Clock, Tv2, ExternalLink, ArrowLeft, ArrowRight,
  Rss, FolderOpen, FileText,
} from 'lucide-react'
import CopyLinkButton from '@/components/media/CopyLinkButton'
import DesignSwitcher from '@/components/projects/DesignSwitcher'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const cms = await getNewsData('en')
  const slugs = cms?.records?.length
    ? cms.records.map((n) => n.slug)
    : newsData.map((n) => n.slug)

  return slugs.flatMap((slug) =>
    ['ar', 'en'].map((locale) => ({ locale, slug }))
  )
}

const CATEGORY_META: Record<string, { ar: string; en: string; color: string }> = {
  news:            { ar: 'خبر',               en: 'News',             color: '#2563eb' },
  activity:        { ar: 'نشاط',              en: 'Activity',         color: '#16a34a' },
  'press-release': { ar: 'بيان صحفي',         en: 'Press Release',    color: '#7c3aed' },
  'media-coverage':{ ar: 'تغطية إعلامية',    en: 'Media Coverage',   color: '#ea580c' },
  'tv-appearance': { ar: 'ظهور إعلامي',       en: 'TV / Radio',       color: '#0891b2' },
  multimedia:      { ar: 'وسائط متعددة',       en: 'Multimedia',       color: '#db2777' },
  announcement:    { ar: 'إعلان',             en: 'Announcement',     color: '#64748b' },
}

function readingTime(content: string) {
  const text = content.replace(/<[^>]*>/g, ' ')
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))
}

function resolveCategoryLabel(
  category: string,
  locale: Locale,
  cmsCategories?: Record<string, string>,
): string {
  if (cmsCategories?.[category]) return cmsCategories[category]
  return CATEGORY_META[category]?.[locale] ?? category
}

function getVariant(_v: string | undefined) {
  const variant = 'classic'
  const map = {
    dark: {
      variant: 'dark' as const,
      page:    'bg-primary-900',
      card:    'bg-white/5 border border-white/10',
      sidebar: 'bg-white/5 border border-white/10',
      heading: 'text-white',
      sub:     'text-white/60',
      label:   'text-white/40',
      badge:   'bg-white/10 text-white/60 border border-white/10',
      divider: 'border-white/10',
      link:    'text-secondary-400 hover:text-secondary-300',
      accent:  'text-secondary-400',
      accentBg:'bg-white/10',
      share:   'bg-white/10 border border-white/10',
      shareHd: 'text-white/50',
      tagBg:   'bg-white/10 text-white/70 border border-white/10',
      prose:   'prose-invert',
    },
    light: {
      variant: 'light' as const,
      page:    'bg-neutral-50',
      card:    'bg-white border border-neutral-100 shadow-sm',
      sidebar: 'bg-white border border-neutral-100 shadow-sm',
      heading: 'text-primary-900',
      sub:     'text-neutral-600',
      label:   'text-neutral-400',
      badge:   'bg-primary-50 text-primary-700 border border-primary-100',
      divider: 'border-neutral-100',
      link:    'text-primary-500 hover:text-secondary-500',
      accent:  'text-primary-500',
      accentBg:'bg-primary-50',
      share:   'bg-white border border-neutral-100 shadow-sm',
      shareHd: 'text-neutral-500',
      tagBg:   'bg-primary-50 text-primary-700 border border-primary-100',
      prose:   '',
    },
    classic: {
      variant: 'classic' as const,
      page:    'bg-gradient-to-br from-primary-50 via-white to-secondary-50/30',
      card:    'bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-sm',
      sidebar: 'bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-sm',
      heading: 'text-primary-900',
      sub:     'text-neutral-600',
      label:   'text-neutral-400',
      badge:   'bg-primary-50 text-primary-700 border border-primary-100',
      divider: 'border-neutral-100',
      link:    'text-primary-500 hover:text-secondary-500',
      accent:  'text-primary-500',
      accentBg:'bg-primary-50',
      share:   'bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-sm',
      shareHd: 'text-neutral-500',
      tagBg:   'bg-primary-50 text-primary-700 border border-primary-100',
      prose:   '',
    },
  }
  return { ...map[variant], variant }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const { v } = await searchParams
  const [item, pageCms] = await Promise.all([
    getNewsBySlug(locale, slug),
    getMediaCenterPageData(locale),
  ])
  if (!item) return {}
  const cmsCategories = cmsConnected(pageCms) ? pageCms?.config?.categories : undefined
  const catLabel = resolveCategoryLabel(item.category, locale, cmsCategories)
  const baseMetadata = buildMetadata({
    locale,
    canonicalPath: `/${locale}/media-center/${slug}`,
    customTitle: item.title[locale],
    customDescription: item.excerpt[locale],
    noIndex: Boolean(v),
    ogType: 'article',
  })

  return {
    ...baseMetadata,
    openGraph: {
      ...(baseMetadata.openGraph as Record<string, unknown>),
      title: item.title[locale],
      description: item.excerpt[locale],
      url: `${BASE_URL}/${locale}/media-center/${slug}`,
      images: [{ url: item.image, width: 800, height: 500, alt: item.title[locale] }],
      type: 'article',
      publishedTime: item.date,
      authors: item.author ? [item.author[locale]] : [],
      tags: item.tags?.map(t => t[locale]) ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title[locale],
      description: item.excerpt[locale],
      images: [item.image],
    },
    other: {
      'article:published_time': item.date,
      'article:section': catLabel,
    },
  }
}

export default async function NewsDetailPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const { v } = await searchParams
  const item = await getNewsBySlug(locale, slug)
  if (!item) notFound()

  const [allNews, pageCms, relatedProject, relatedPublication] = await Promise.all([
    getNews(locale),
    getMediaCenterPageData(locale),
    item.relatedProject ? getProjectBySlug(locale, item.relatedProject) : null,
    item.relatedPublication ? getPublicationBySlug(locale, item.relatedPublication) : null,
  ])
  const connected = cmsConnected(pageCms)
  const cmsCategories = connected ? pageCms?.config?.categories : undefined
  const related = resolveRelatedNews(item, allNews)

  const isRTL = locale === 'ar'
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const catLabel = resolveCategoryLabel(item.category, locale, cmsCategories)
  const cat = CATEGORY_META[item.category]
  const mins = readingTime(item.content[locale as Locale])
  const V = getVariant(v)
  const imageUnoptimized = isCmsHostedMediaUrl(item.image)

  const basePath = `/${locale}/media-center/${slug}`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title[locale as Locale],
    description: item.excerpt[locale as Locale],
    image: item.image,
    datePublished: item.date,
    dateModified: item.date,
    author: item.author ? [{ '@type': 'Person', name: item.author[locale as Locale] }] : [],
    publisher: {
      '@type': 'Organization',
      name: 'We Rise',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-en.svg` },
    },
    mainEntityOfPage: `${BASE_URL}/${locale}/media-center/${slug}`,
  }

  /* share URLs (used client-side via href) */
  const pageUrl = `${BASE_URL}/${locale}/media-center/${slug}`
  const shareTwitter  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title[locale as Locale])}&url=${encodeURIComponent(pageUrl)}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(item.title[locale as Locale] + '\n' + pageUrl)}`

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
        { name: isRTL ? 'المركز الإعلامي' : 'Media Center', url: `${BASE_URL}/${locale}/media-center` },
        { name: item.title[locale as Locale], url: `${BASE_URL}/${locale}/media-center/${slug}` },
      ])} />
      <JsonLd data={articleSchema} />

      {/* ── HERO ── */}
      <div className="relative min-h-[55vh] overflow-hidden bg-primary-900 flex items-end">
        <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover opacity-25 blur-sm scale-105" sizes="100vw" priority unoptimized={imageUnoptimized} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/20" />
        <div className="relative z-10 container-wide pb-14 pt-28 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40 mb-6 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white/70 transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <Link href={`/${locale}/media-center`} className="hover:text-white/70 transition-colors">{isRTL ? 'المركز الإعلامي' : 'Media Center'}</Link>
            <span>/</span>
            <span className="text-white/60 line-clamp-1">{item.title[locale as Locale]}</span>
          </div>

          {/* Category badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: (cat?.color ?? '#2B245B') + '25', color: cat?.color ?? '#fff', border: `1px solid ${cat?.color ?? '#2B245B'}40` }}>
            {catLabel}
          </div>

          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl mb-5">
            {item.title[locale as Locale]}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date(item.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {item.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {item.author[locale as Locale]}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {isRTL ? `${mins} دقيقة قراءة` : `${mins} min read`}
            </span>
            {item.source && (
              <span className="flex items-center gap-1.5">
                <Rss className="w-3.5 h-3.5" />
                {item.source[locale as Locale]}
              </span>
            )}
            {item.channel && (
              <span className="flex items-center gap-1.5">
                <Tv2 className="w-3.5 h-3.5" />
                {item.channel[locale as Locale]}
              </span>
            )}
            {item.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {item.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={`min-h-screen ${V.page}`}>
        <div className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ─ MAIN COLUMN ─ */}
            <article className="lg:col-span-2 space-y-8">

              {/* Hero image full */}
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover" sizes="800px" priority unoptimized={imageUnoptimized} />
              </div>

              {/* Excerpt / lead */}
              <p className={`text-lg font-semibold leading-relaxed border-s-4 border-primary-500 ps-5 ${V.sub}`}>
                {item.excerpt[locale as Locale]}
              </p>

              {/* Video embed */}
              {item.embedUrl && (
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  {item.embedType === 'youtube' ? (
                    <iframe src={item.embedUrl} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={item.title[locale as Locale]} />
                  ) : item.embedType === 'facebook' ? (
                    <iframe src={item.embedUrl} className="w-full aspect-video" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen title={item.title[locale as Locale]} />
                  ) : item.embedType === 'instagram' ? (
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover" sizes="600px" unoptimized={imageUnoptimized} />
                      <a href={item.embedUrl} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-3">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        <span className="font-bold">{isRTL ? 'مشاهدة على إنستغرام' : 'View on Instagram'}</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Content body */}
              <div className={`prose prose-lg max-w-none prose-headings:font-black prose-p:leading-relaxed ${V.prose}`}
                dir={isRTL ? 'rtl' : 'ltr'}>
                <CmsRichText html={item.content[locale as Locale]} />
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className={`flex flex-wrap items-center gap-2 pt-4 border-t ${V.divider}`}>
                  <Tag className={`w-4 h-4 shrink-0 ${V.label}`} />
                  {item.tags.map((tag, i) => (
                    <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full ${V.tagBg}`}>
                      {tag[locale as Locale]}
                    </span>
                  ))}
                </div>
              )}

              {/* External source link */}
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-black transition-colors border px-4 py-2.5 rounded-2xl ${V.badge} ${V.link}`}>
                  <ExternalLink className="w-4 h-4" />
                  {isRTL ? `قراءة المصدر الأصلي: ${item.source?.[locale as Locale] ?? ''}` : `Read original source: ${item.source?.[locale as Locale] ?? ''}`}
                </a>
              )}

              {/* ─ Social sharing ─ */}
              <div className={`rounded-3xl p-6 ${V.share}`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-4 ${V.shareHd}`}>{isRTL ? 'مشاركة المقال' : 'Share this article'}</p>
                <div className="flex flex-wrap gap-3">
                  <a href={shareTwitter} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-neutral-800 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    {isRTL ? 'تويتر' : 'Twitter / X'}
                  </a>
                  <a href={shareFacebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1877F2] text-white text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-[#166FE5] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    {isRTL ? 'فيسبوك' : 'Facebook'}
                  </a>
                  <a href={shareWhatsApp} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-[#20BD5A] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {isRTL ? 'واتساب' : 'WhatsApp'}
                  </a>
                  <CopyLinkButton url={pageUrl} labelAr="نسخ الرابط" labelEn="Copy link" isRTL={isRTL} />
                </div>
              </div>

              {/* ─ Back button ─ */}
              <Link href={`/${locale}/media-center`}
                className={`inline-flex items-center gap-2 text-sm font-black transition-colors ${V.link}`}>
                <ArrowBack className="w-4 h-4" />
                {isRTL ? 'العودة إلى المركز الإعلامي' : 'Back to Media Center'}
              </Link>
            </article>

            {/* ─ SIDEBAR ─ */}
            <aside className="space-y-6">

              {/* Category info */}
              <div className={`rounded-3xl p-6 ${V.sidebar}`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${V.label}`}>{isRTL ? 'التصنيف' : 'Category'}</p>
                <div className="inline-flex items-center gap-2 text-sm font-black px-4 py-2 rounded-2xl"
                  style={{ backgroundColor: (cat?.color ?? '#2B245B') + '15', color: cat?.color ?? '#2B245B' }}>
                  {catLabel}
                </div>
              </div>

              {/* Article info */}
              <div className={`rounded-3xl p-6 space-y-4 ${V.sidebar}`}>
                <p className={`text-xs font-black uppercase tracking-widest ${V.label}`}>{isRTL ? 'معلومات المقال' : 'Article Info'}</p>
                <div className="space-y-3 text-sm">
                  <div className={`flex items-center gap-3 ${V.sub}`}>
                    <CalendarDays className={`w-4 h-4 shrink-0 ${V.label}`} />
                    <span>{new Date(item.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {item.author && (
                    <div className={`flex items-center gap-3 ${V.sub}`}>
                      <User className={`w-4 h-4 shrink-0 ${V.label}`} />
                      <span>{item.author[locale as Locale]}</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-3 ${V.sub}`}>
                    <Clock className={`w-4 h-4 shrink-0 ${V.label}`} />
                    <span>{isRTL ? `${mins} دقيقة قراءة` : `${mins} min read`}</span>
                  </div>
                  {item.source && (
                    <div className={`flex items-center gap-3 ${V.sub}`}>
                      <Rss className={`w-4 h-4 shrink-0 ${V.label}`} />
                      <span>{item.source[locale as Locale]}</span>
                    </div>
                  )}
                </div>
              </div>

              {relatedProject && (
                <div className={`rounded-3xl p-6 ${V.sidebar}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-4 ${V.label}`}>
                    {isRTL ? 'المشروع المرتبط' : 'Related Project'}
                  </p>
                  <Link
                    href={`/${locale}/programs-projects/${relatedProject.slug}`}
                    className="group flex gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={relatedProject.featuredImage}
                        alt={relatedProject.title[locale as Locale]}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized={isCmsHostedMediaUrl(relatedProject.featuredImage)}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black leading-snug line-clamp-2 ${V.heading}`}>
                        {relatedProject.title[locale as Locale]}
                      </p>
                      <p className={`text-[10px] mt-1 line-clamp-2 ${V.sub}`}>
                        {relatedProject.shortDescription[locale as Locale]}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-2 ${V.link}`}>
                        <FolderOpen className="w-3 h-3" />
                        {isRTL ? 'عرض المشروع' : 'View project'}
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {relatedPublication && (
                <div className={`rounded-3xl p-6 ${V.sidebar}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-4 ${V.label}`}>
                    {isRTL ? 'المنشور المرتبط' : 'Related Publication'}
                  </p>
                  <Link
                    href={`/${locale}/publications-reports/${relatedPublication.slug}`}
                    className="group flex gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={relatedPublication.coverImage}
                        alt={relatedPublication.title[locale as Locale]}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized={isCmsHostedMediaUrl(relatedPublication.coverImage)}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black leading-snug line-clamp-2 ${V.heading}`}>
                        {relatedPublication.title[locale as Locale]}
                      </p>
                      <p className={`text-[10px] mt-1 line-clamp-2 ${V.sub}`}>
                        {relatedPublication.summary[locale as Locale]}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-2 ${V.link}`}>
                        <FileText className="w-3 h-3" />
                        {isRTL ? 'عرض المنشور' : 'View publication'}
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Related items */}
              {related.length > 0 && (
                <div className={`rounded-3xl p-6 ${V.sidebar}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-4 ${V.label}`}>{isRTL ? 'محتوى ذو صلة' : 'Related Content'}</p>
                  <div className="space-y-4">
                    {related.map(rel => (
                      <Link key={rel.id} href={`/${locale}/media-center/${rel.slug}`}
                        className="group flex gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={rel.image} alt={rel.title[locale as Locale]} fill className="object-cover" sizes="64px" unoptimized={isCmsHostedMediaUrl(rel.image)} />
                        </div>
                        <div>
                          <p className={`text-xs font-black leading-snug line-clamp-2 transition-colors ${V.heading}`}>{rel.title[locale as Locale]}</p>
                          <p className={`text-[10px] mt-1 ${V.label}`}>{new Date(rel.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current={V.variant as 'light' | 'dark' | 'classic'} isRTL={isRTL} />
    </>
  )
}
