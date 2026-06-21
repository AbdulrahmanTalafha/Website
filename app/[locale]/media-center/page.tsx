import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getNews, getNewsStats } from '@/lib/api'
import { getMediaCenterPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl, isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import { resolveMediaCenterPageSeo } from '@/lib/mediaCenterPageSeo'
import {
  Newspaper, Activity, FileText, Tv2, Radio, PlaySquare,
  Rss, TrendingUp, Calendar, ExternalLink, ArrowUpRight,
  Clock, User, Tag, Search, Filter, ChevronRight,
} from 'lucide-react'
import type { NewsItem, MediaCategory } from '@/types'
import DesignSwitcher from '@/components/projects/DesignSwitcher'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ v?: string; tab?: string }>
}

export const revalidate = 60

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const { v, tab } = await searchParams
  const pageCms = await getMediaCenterPageData(locale)
  const seo = resolveMediaCenterPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/media-center`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex || Boolean(v || tab),
  })
}

/* ── Category config ── */
const CATEGORIES: {
  id: MediaCategory | 'all'
  icon: React.ElementType
  ar: string
  en: string
  color: string
  bg: string
}[] = [
  { id: 'all',           icon: Rss,         ar: 'الكل',                  en: 'All',              color: '#2B245B', bg: 'bg-primary-500/15'   },
  { id: 'news',          icon: Newspaper,   ar: 'الأخبار',               en: 'News',             color: '#2563eb', bg: 'bg-blue-500/15'      },
  { id: 'activity',      icon: Activity,    ar: 'الأنشطة',               en: 'Activities',       color: '#16a34a', bg: 'bg-green-500/15'     },
  { id: 'press-release', icon: FileText,    ar: 'البيانات الصحفية',      en: 'Press Releases',   color: '#7c3aed', bg: 'bg-purple-500/15'   },
  { id: 'media-coverage',icon: Rss,         ar: 'التغطية الإعلامية',     en: 'Media Coverage',   color: '#ea580c', bg: 'bg-orange-500/15'   },
  { id: 'tv-appearance', icon: Tv2,         ar: 'الظهور التلفزيوني',     en: 'TV & Radio',       color: '#0891b2', bg: 'bg-cyan-500/15'     },
  { id: 'multimedia',    icon: PlaySquare,  ar: 'الوسائط المتعددة',      en: 'Multimedia',       color: '#db2777', bg: 'bg-pink-500/15'     },
]

const CAT_LABEL: Record<string, Record<string, string>> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, { ar: c.ar, en: c.en }])
)

function catLabel(cat: string, locale: string, cmsCategories?: Record<string, string>) {
  if (cmsCategories?.[cat]) return cmsCategories[cat]
  return CAT_LABEL[cat]?.[locale] ?? cat
}

function catColor(cat: string) {
  return CATEGORIES.find(c => c.id === cat)?.color ?? '#2B245B'
}
function catBg(cat: string) {
  return CATEGORIES.find(c => c.id === cat)?.bg ?? 'bg-primary-500/15'
}

/* ── Reading time ── */
function readingTime(content: string, locale: string) {
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return locale === 'ar' ? `${mins} دقيقة قراءة` : `${mins} min read`
}

/* ── Card ── */
function MediaCard({ item, locale, V, isRTL, cmsCategories }: { item: NewsItem; locale: string; V: ReturnType<typeof getVariant>; isRTL: boolean; cmsCategories?: Record<string, string> }) {
  const cat = CATEGORIES.find(c => c.id === item.category)
  const Icon = cat?.icon ?? Newspaper
  return (
    <Link
      href={`/${locale}/media-center/${item.slug}`}
      className={`group rounded-3xl overflow-hidden transition-all block ${V.card} ${V.cardHov}`}
    >
      <div className="relative aspect-video overflow-hidden bg-neutral-800">
        <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 400px" unoptimized={isCmsHostedMediaUrl(item.image)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {item.featured && (
          <div className="absolute top-3 end-3 bg-secondary-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
            {isRTL ? 'مميز' : 'Featured'}
          </div>
        )}
        <div className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm text-white bg-black/30">
          <Icon className="w-3 h-3" />
          {catLabel(item.category, locale, cmsCategories)}
        </div>
      </div>
      <div className="p-5">
        <div className={`flex items-center gap-3 text-xs mb-3 ${V.label}`}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          {item.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.author[locale as Locale]}</span>}
        </div>
        <h3 className={`font-black text-base mb-2 leading-snug line-clamp-2 ${V.heading}`}>{item.title[locale as Locale]}</h3>
        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${V.sub}`}>{item.excerpt[locale as Locale]}</p>
        <div className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${V.link}`}>
          {isRTL ? 'اقرأ المزيد' : 'Read more'}
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

/* ── Variant tokens ── */
function getVariant(variant: 'dark' | 'light' | 'classic') {
  const map = {
    dark: {
      page:    'bg-primary-900',
      heroBg:  'bg-primary-900',
      heroImg: 'opacity-15 blur-2xl scale-110',
      heroTxt: 'text-white',
      heroSub: 'text-white/60',
      heroAcc: 'text-secondary-400',
      card:    'bg-white/5 border border-white/10',
      cardHov: 'hover:bg-white/10 hover:border-white/20',
      heading: 'text-white',
      sub:     'text-white/60',
      label:   'text-white/40',
      badge:   'bg-white/10 text-white/70 border border-white/10',
      nav:     'bg-primary-900/95 backdrop-blur-md border-b border-white/10',
      navItem: 'text-white/50',
      navAct:  'text-white border-b-2 border-secondary-400',
      input:   'bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none',
      divider: 'border-white/10',
      link:    'text-secondary-400 group-hover:text-secondary-300',
      stat:    'bg-white/5 border border-white/10',
      statTxt: 'text-white',
      blob1:   '',
      blob2:   '',
    },
    light: {
      page:    'bg-neutral-50',
      heroBg:  'bg-primary-800',
      heroImg: 'opacity-20',
      heroTxt: 'text-white',
      heroSub: 'text-white/70',
      heroAcc: 'text-secondary-300',
      card:    'bg-white border border-neutral-100 shadow-sm',
      cardHov: 'hover:shadow-md hover:border-primary-200',
      heading: 'text-primary-900',
      sub:     'text-neutral-600',
      label:   'text-neutral-400',
      badge:   'bg-primary-50 text-primary-700 border border-primary-100',
      nav:     'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm',
      navItem: 'text-neutral-400',
      navAct:  'text-primary-600 border-b-2 border-primary-500',
      input:   'bg-white border border-neutral-200 text-primary-900 placeholder:text-neutral-300 focus:border-primary-300 focus:outline-none',
      divider: 'border-neutral-100',
      link:    'text-primary-500 group-hover:text-secondary-500',
      stat:    'bg-white border border-neutral-100 shadow-sm',
      statTxt: 'text-primary-900',
      blob1:   'bg-primary-100/30',
      blob2:   'bg-secondary-100/20',
    },
    classic: {
      page:    '',
      heroBg:  'bg-primary-900',
      heroImg: 'opacity-20',
      heroTxt: 'text-white',
      heroSub: 'text-white/65',
      heroAcc: 'text-secondary-400',
      card:    'bg-white/80 backdrop-blur-sm border border-neutral-100/80 shadow-sm',
      cardHov: 'hover:shadow-lg hover:border-primary-200/80',
      heading: 'text-primary-900',
      sub:     'text-neutral-600',
      label:   'text-neutral-400',
      badge:   'bg-primary-50 text-primary-700 border border-primary-100',
      nav:     'bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm',
      navItem: 'text-neutral-400',
      navAct:  'text-primary-600 border-b-2 border-primary-500',
      input:   'bg-white/80 border border-neutral-200 text-primary-900 placeholder:text-neutral-300 focus:border-primary-300 focus:outline-none backdrop-blur-sm',
      divider: 'border-neutral-100',
      link:    'text-primary-500 group-hover:text-secondary-500',
      stat:    'bg-white/80 border border-neutral-100 shadow-sm',
      statTxt: 'text-primary-900',
      blob1:   'bg-primary-100/40',
      blob2:   'bg-secondary-100/30',
    },
  }
  return map[variant]
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }> | undefined,
  stats: { total: number; by_category: Record<string, number> },
) {
  if (connected && useLiveStats && cmsStats?.length) {
    return cmsStats.map((stat) => {
      const statKey = stat.stat_key ?? 'total'
      const liveValue = statKey === 'total'
        ? stats.total
        : (stats.by_category[statKey] ?? 0)

      return {
        value: `${liveValue}${stat.suffix ?? ''}`,
        label: stat.label,
      }
    })
  }

  if (connected && cmsStats?.length) {
    return cmsStats.map((s) => ({
      value: `${s.value}${s.suffix ?? ''}`,
      label: s.label,
    }))
  }

  return []
}

export default async function MediaCenterPage({ params, searchParams }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const { v, tab } = await searchParams
  const variant = 'classic' as 'dark' | 'light' | 'classic'
  const activeTab: MediaCategory | 'all' = (tab as MediaCategory | 'all') || 'all'

  const [allNews, stats, pageCms] = await Promise.all([
    getNews(locale),
    getNewsStats(locale),
    getMediaCenterPageData(locale),
  ])
  const connected = cmsConnected(pageCms)
  const cmsCategories = connected ? pageCms?.config?.categories : undefined
  const hero = pageCms?.sections?.hero
  const mediaGrid = pageCms?.sections?.media_grid
  const seo = resolveMediaCenterPageSeo(pageCms, locale)
  const isRTL = locale === 'ar'
  const V = getVariant(variant)
  const isDark = variant === 'dark'
  const pageTitle = cmsText(
    connected,
    hero?.badge,
    seo.title,
  ) ?? seo.title
  const pageDescription = cmsText(
    connected,
    hero?.subtitle,
    seo.description,
  ) ?? seo.description
  const heroTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'أخبارنا وفعالياتنا وأنشطتنا الإعلامية' : 'Our News, Events & Media Activities',
  ) ?? (isRTL ? 'أخبارنا وفعالياتنا وأنشطتنا الإعلامية' : 'Our News, Events & Media Activities')
  const heroSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL ? 'تابع آخر أخبار وبيانات وأنشطة وتغطيات مركز We Rise للمواطنة والتنمية.' : 'Follow the latest news, statements, activities, and media coverage of We Rise Center.',
  ) ?? (isRTL ? 'تابع آخر أخبار وبيانات وأنشطة وتغطيات مركز We Rise للمواطنة والتنمية.' : 'Follow the latest news, statements, activities, and media coverage of We Rise Center.')
  const gridTitle = cmsText(
    connected,
    mediaGrid?.title,
    isRTL ? 'جميع المحتويات' : 'All Content',
  ) ?? (isRTL ? 'جميع المحتويات' : 'All Content')
  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? false,
    hero?.stats,
    stats,
  )

  const basePath    = `/${locale}/media-center`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`

  /* Dashboard counts per category */
  const counts = Object.fromEntries(
    CATEGORIES.map(c => [c.id, c.id === 'all' ? allNews.length : allNews.filter(n => n.category === c.id).length])
  )

  /* Filtered items for active tab */
  const filtered = activeTab === 'all' ? allNews : allNews.filter(n => n.category === activeTab)

  /* Featured item */
  const featured = allNews.find(n => n.featured) ?? allNews[0]

  const heroImage = resolveCmsMediaUrl(
    hero?.background_image,
    undefined,
    'https://picsum.photos/seed/werise-media-hero/1400/600',
  )

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/media-center` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${BASE_URL}/${locale}/media-center`,
          locale,
        }),
      ]} />

      {/* ─── HERO ─── */}
      <div className={`relative min-h-[50vh] overflow-hidden flex items-end ${V.heroBg}`}>
        <Image src={heroImage} alt="" fill className={`object-cover ${V.heroImg}`} sizes="100vw" priority unoptimized={isCmsHostedMediaUrl(heroImage)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(250,56,46,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 container-wide pb-14 pt-24 w-full">
          <div className="flex items-center gap-2 mb-4">
            <Rss className={`w-4 h-4 ${V.heroAcc}`} />
            <span className={`text-xs font-black uppercase tracking-widest ${V.heroAcc}`}>{pageTitle}</span>
          </div>
          <h1 className={`text-3xl md:text-5xl font-black leading-tight max-w-2xl mb-4 ${V.heroTxt}`}>
            {heroTitle}
          </h1>
          <p className={`max-w-xl ${V.heroSub}`}>
            {heroSubtitle}
          </p>
          {heroStats.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              {heroStats.map((stat) => (
                <div key={stat.label} className={`rounded-2xl px-5 py-3 ${V.stat}`}>
                  <div className={`text-2xl font-black ${V.statTxt}`}>{stat.value}</div>
                  <div className={`text-xs font-bold mt-1 ${V.heroSub}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── STICKY TABS ─── */}
      <div className={`sticky top-10 z-30 ${V.nav}`}>
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <Link key={cat.id}
                href={`${basePath}?v=${v ?? ''}&tab=${cat.id}`}
                className={`flex items-center gap-2 px-4 py-4 text-xs font-black whitespace-nowrap shrink-0 border-b-2 transition-all ${isActive ? V.navAct : `border-transparent ${V.navItem} hover:opacity-100`}`}
                style={isActive ? { borderColor: cat.color, color: cat.color } : {}}
              >
                <Icon className="w-3.5 h-3.5" />
                {cmsCategories?.[cat.id] ?? (isRTL ? cat.ar : cat.en)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? '' : V.badge}`}
                  style={isActive ? { backgroundColor: cat.color + '20', color: cat.color } : {}}>
                  {counts[cat.id] ?? 0}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className={`relative min-h-screen ${V.page}`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-24 -start-24 w-96 h-96 rounded-full blur-3xl ${V.blob1}`} />
          <div className={`absolute top-1/2 -end-20 w-80 h-80 rounded-full blur-3xl ${V.blob2}`} />
        </div>

        <div className="relative container-wide py-10 space-y-10">

          {/* ── FEATURED (only on 'all' tab) ── */}
          {activeTab === 'all' && featured && (
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-5 ${V.heroAcc}`}>
                <div className={`w-6 h-0.5 rounded-full ${V.heroAcc}`} />
                {isRTL ? 'المحتوى المميز' : 'Featured Content'}
              </div>
              <Link href={`/${locale}/media-center/${featured.slug}`}
                className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden transition-all ${V.card} ${V.cardHov}`}>
                <div className="relative h-64 lg:h-full overflow-hidden">
                  <Image src={featured.image} alt={featured.title[locale as Locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="700px" unoptimized={isCmsHostedMediaUrl(featured.image)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4"
                    style={{ backgroundColor: catColor(featured.category) + '20', color: catColor(featured.category) }}>
                    {catLabel(featured.category, locale, cmsCategories)}
                  </div>
                  <h2 className={`text-xl md:text-2xl font-black leading-snug mb-3 ${V.heading}`}>{featured.title[locale as Locale]}</h2>
                  <p className={`text-sm leading-relaxed mb-5 ${V.sub}`}>{featured.excerpt[locale as Locale]}</p>
                  <div className={`flex items-center gap-4 text-xs ${V.label}`}>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(featured.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {featured.author && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{featured.author[locale as Locale]}</span>}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── MULTIMEDIA embeds section ── */}
          {(activeTab === 'multimedia' || activeTab === 'tv-appearance') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.filter(i => i.embedUrl).map(item => (
                <div key={item.id} className={`rounded-3xl overflow-hidden ${V.card}`}>
                  {item.embedType === 'youtube' ? (
                    <iframe
                      src={item.embedUrl}
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={item.title[locale as Locale]}
                    />
                  ) : item.embedType === 'facebook' ? (
                    <iframe
                      src={item.embedUrl}
                      className="w-full aspect-video"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      title={item.title[locale as Locale]}
                    />
                  ) : item.embedType === 'instagram' ? (
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover" sizes="500px" unoptimized={isCmsHostedMediaUrl(item.image)} />
                      <a href={item.embedUrl} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-3">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        <span className="text-sm font-bold">{isRTL ? 'مشاهدة على إنستغرام' : 'View on Instagram'}</span>
                      </a>
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className={`font-black text-sm mb-2 ${V.heading}`}>{item.title[locale as Locale]}</h3>
                    <p className={`text-xs ${V.sub}`}>{item.excerpt[locale as Locale]}</p>
                    {(item.duration || item.channel) && (
                      <div className={`flex items-center gap-3 mt-3 text-xs ${V.label}`}>
                        {item.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>}
                        {item.channel && <span className="flex items-center gap-1"><Tv2 className="w-3 h-3" />{item.channel[locale as Locale]}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MEDIA COVERAGE external links ── */}
          {activeTab === 'media-coverage' && (
            <div className="space-y-4">
              {filtered.map(item => (
                <div key={item.id} className={`rounded-2xl p-5 flex gap-5 items-center transition-all ${V.card} ${V.cardHov}`}>
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title[locale as Locale]} fill className="object-cover" sizes="80px" unoptimized={isCmsHostedMediaUrl(item.image)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold mb-1 ${V.label}`}>{item.source?.[locale as Locale]} · {new Date(item.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'short' })}</div>
                    <h3 className={`font-black text-sm mb-1.5 line-clamp-2 ${V.heading}`}>{item.title[locale as Locale]}</h3>
                    <p className={`text-xs line-clamp-1 ${V.sub}`}>{item.excerpt[locale as Locale]}</p>
                  </div>
                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className={`shrink-0 flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl transition-colors ${V.badge} hover:opacity-80`}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      {isRTL ? 'المصدر' : 'Source'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── GENERAL GRID (news, activities, press-releases, all) ── */}
          {(activeTab === 'all' || activeTab === 'news' || activeTab === 'activity' || activeTab === 'press-release') && (
            <div>
              {activeTab === 'all' && (
                <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-5 ${V.heroAcc}`}>
                  <div className={`w-6 h-0.5 rounded-full ${V.heroAcc}`} />
                  {gridTitle}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'all' ? allNews : filtered).map(item => (
                  <MediaCard key={item.id} item={item} locale={locale} V={V} isRTL={isRTL} cmsCategories={cmsCategories} />
                ))}
              </div>
            </div>
          )}



        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current={variant} isRTL={isRTL} />
    </>
  )
}
