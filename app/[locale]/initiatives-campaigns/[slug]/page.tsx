import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildArticleSchema, buildBreadcrumbSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getInitiativeBySlug, getInitiatives, getProjectBySlug } from '@/lib/api'
import { getSettings } from '@/lib/cms'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { projectsData } from '@/data/projects'
import { formatInitiativeReach } from '@/lib/initiativeDisplay'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import {
  Calendar, CheckCircle2, ArrowLeft, ArrowRight,
  Target, Megaphone, ExternalLink, Sparkles, ChevronRight, ChevronLeft, FolderOpen, PlayCircle,
} from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'
import CmsRichText from '@/components/common/CmsRichText'
import DesignSwitcher from '@/components/projects/DesignSwitcher'

interface InitiativeDetailProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const initiatives = await getInitiatives('en')
  return initiatives.flatMap(i =>
    ['ar', 'en'].map(locale => ({ locale, slug: i.slug }))
  )
}

export async function generateMetadata({ params, searchParams }: InitiativeDetailProps): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const { v } = await searchParams
  const initiative = await getInitiativeBySlug(locale, slug)
  if (!initiative) return {}

  const summary = initiative.shortDescription[locale]

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/initiatives-campaigns/${slug}`,
    customTitle: initiative.title[locale],
    customDescription: summary,
    noIndex: Boolean(v),
    ogType: 'article',
  })
}

const CATEGORY = {
  'initiative':         { ar: 'مبادرة',       en: 'Initiative',         badge: 'bg-purple-50 text-purple-700 border-purple-200',  dark: 'bg-purple-500/20 text-purple-300 border-purple-500/30',  dot: 'bg-purple-500',  color: '#8b5cf6' },
  'digital-campaign':   { ar: 'حملة رقمية',   en: 'Digital Campaign',   badge: 'bg-blue-50 text-blue-700 border-blue-200',         dark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',        dot: 'bg-blue-500',    color: '#3b82f6' },
  'advocacy-campaign':  { ar: 'حملة مناصرة',  en: 'Advocacy Campaign',  badge: 'bg-orange-50 text-orange-700 border-orange-200',   dark: 'bg-orange-500/20 text-orange-300 border-orange-500/30',  dot: 'bg-orange-500',  color: '#f59e0b' },
  'awareness-campaign': { ar: 'حملة توعية',   en: 'Awareness Campaign', badge: 'bg-green-50 text-green-700 border-green-200',      dark: 'bg-green-500/20 text-green-300 border-green-500/30',     dot: 'bg-green-500',   color: '#10b981' },
}

export default async function InitiativeDetailPage({ params, searchParams }: InitiativeDetailProps) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  await searchParams
  const variant = 'classic' as 'dark' | 'light' | 'classic'

  const initiative = await getInitiativeBySlug(locale, slug)
  if (!initiative) notFound()

  const settings = await getSettings(locale)
  const site = resolveSiteSettings(settings, locale)

  const isRTL = locale === 'ar'
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const Chevron = isRTL ? ChevronLeft : ChevronRight
  const cat = CATEGORY[initiative.category]
  const ongoing = !initiative.endDate || new Date(initiative.endDate) >= new Date()
  const reachDisplay = formatInitiativeReach(initiative, locale)

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })

  const relatedProject = initiative.relatedProject
    ? await getProjectBySlug(locale, initiative.relatedProject)
      ?? projectsData.find(p => p.id === initiative.relatedProject || p.slug === initiative.relatedProject)
    : null

  const basePath    = `/${locale}/initiatives-campaigns/${slug}`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`
  const summary = initiative.shortDescription[locale]
  const schemas = [
    buildBreadcrumbSchema([
      { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
      { name: isRTL ? 'المبادرات والحملات' : 'Initiatives & Campaigns', url: `${BASE_URL}/${locale}/initiatives-campaigns` },
      { name: initiative.title[locale], url: `${BASE_URL}/${locale}/initiatives-campaigns/${slug}` },
    ]),
    ...(summary
      ? [buildArticleSchema({
          title: initiative.title[locale],
          description: summary,
          datePublished: initiative.startDate,
          image: initiative.featuredImage,
          locale,
          site,
        })]
      : []),
  ]

  /* ─────────────────────────────────────────────
     DARK VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'dark') return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden bg-primary-900">
        <Image src={initiative.featuredImage} alt={initiative.title[locale]} fill className="object-cover opacity-40" priority sizes="100vw" unoptimized={isCmsHostedMediaUrl(initiative.featuredImage)} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 to-transparent" />

        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5 flex items-center justify-between">
          <Link href={`/${locale}/initiatives-campaigns`} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 transition-all group">
            <ArrowBack className="w-3.5 h-3.5 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
            {isRTL ? 'جميع المبادرات' : 'All Initiatives'}
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 container-wide pb-10 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cat.dark}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} ${ongoing ? 'animate-pulse' : ''}`} />
              {cat[isRTL ? 'ar' : 'en']}
            </div>
            {ongoing && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {isRTL ? 'جارٍ' : 'Ongoing'}
              </div>
            )}
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight max-w-3xl">{initiative.title[locale]}</h1>
          <p className="text-white/60 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">{initiative.shortDescription[locale]}</p>
        </div>
      </div>

      {/* Chapter nav */}
      <div className="sticky top-10 z-30 bg-primary-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[
            { num: '01', label: isRTL ? 'الوصف' : 'Description', href: '#description' },
            { num: '02', label: isRTL ? 'الهدف' : 'Objective',   href: '#objective' },
            { num: '03', label: isRTL ? 'المخرجات' : 'Outputs',  href: '#outputs' },
            { num: '04', label: isRTL ? 'الصور' : 'Gallery',     href: '#gallery' },
          ].map((ch, i) => (
            <a key={i} href={ch.href} className="flex items-center gap-2 px-5 py-4 text-xs font-black text-white/40 hover:text-white border-b-2 border-transparent hover:border-secondary-400 transition-all whitespace-nowrap shrink-0">
              <span className="text-secondary-500/60">{ch.num}</span>
              {ch.label}
            </a>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="bg-primary-900 min-h-screen">
        <div className="container-wide py-12 space-y-16">

          {/* Description */}
          <div id="description" className="scroll-mt-24 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '33' }}>
                <Megaphone className="w-4 h-4" style={{ color: cat.color }} />
              </div>
              <h2 className="text-lg font-black text-white">{isRTL ? 'عن النشاط' : 'About'}</h2>
            </div>
            <CmsRichText
              html={initiative.description[locale]}
              className="cms-rich-text-invert text-base"
            />
          </div>

          {/* Objective */}
          <div id="objective" className="scroll-mt-24 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '33' }}>
                <Target className="w-4 h-4" style={{ color: cat.color }} />
              </div>
              <h2 className="text-lg font-black text-white">{isRTL ? 'الهدف من النشاط' : 'Objective'}</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-base">{initiative.objective[locale]}</p>
            <div className="flex items-center gap-3 mt-6 text-sm text-white/40">
              <Calendar className="w-4 h-4" />
              <span>{fmtDate(initiative.startDate)}</span>
              {initiative.endDate && <><span className="text-white/20">—</span><span>{fmtDate(initiative.endDate)}</span></>}
            </div>
            {reachDisplay && (
              <p className="text-sm text-white/60 mt-4">
                <span className="font-bold text-white/80">{isRTL ? 'الوصول:' : 'Reach:'}</span> {reachDisplay}
              </p>
            )}
          </div>

          {/* Outputs */}
          <div id="outputs" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '33' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: cat.color }} />
              </div>
              <h2 className="text-lg font-black text-white">{isRTL ? 'المخرجات' : 'Outputs'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initiative.outputs.map((output, i) => (
                <div key={i} className="flex gap-3 bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-white" style={{ backgroundColor: cat.color }}>
                    {i + 1}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{output[locale]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {(initiative.images.length > 0 || (initiative.videos && initiative.videos.length > 0)) && (
            <div id="gallery" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10">
                  <Sparkles className="w-4 h-4 text-white/60" />
                </div>
                <h2 className="text-lg font-black text-white">{isRTL ? 'الصور والفيديو' : 'Media'}</h2>
              </div>
              {initiative.videos && initiative.videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {initiative.videos.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
                      <iframe src={url} title={`${initiative.title[locale]} video ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
              {initiative.images.length > 0 && (
                <ProjectGallery
                  images={initiative.images}
                  alt={initiative.title[locale]}
                  variant="dark"
                  isRTL={isRTL}
                />
              )}
            </div>
          )}

          {/* Related Project */}
          {relatedProject && (
            <div className="scroll-mt-24 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '33' }}>
                  <FolderOpen className="w-4 h-4" style={{ color: cat.color }} />
                </div>
                <h2 className="text-lg font-black text-white">{isRTL ? 'المشروع المرتبط' : 'Related Project'}</h2>
              </div>
              <Link href={`/${locale}/programs-projects/${relatedProject.slug}`} className="group flex items-center gap-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-white/10">
                  <Image src={relatedProject.featuredImage} alt={relatedProject.title[locale]} fill className="object-cover" sizes="80px" unoptimized={isCmsHostedMediaUrl(relatedProject.featuredImage)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm leading-tight truncate">{relatedProject.title[locale]}</p>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">{relatedProject.shortDescription[locale]}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 shrink-0 transition-colors" />
              </Link>
            </div>
          )}

          {/* Back link */}
          <div className="pt-4 border-t border-white/10">
            <Link href={`/${locale}/initiatives-campaigns`} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold">
              <ArrowBack className="w-4 h-4" />
              {isRTL ? 'العودة إلى المبادرات' : 'Back to Initiatives'}
            </Link>
          </div>
        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current="dark" isRTL={isRTL} />
    </>
  )

  /* ─────────────────────────────────────────────
     LIGHT VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'light') return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[440px] overflow-hidden bg-neutral-100">
        <Image src={initiative.featuredImage} alt={initiative.title[locale]} fill className="object-cover opacity-60" priority sizes="100vw" unoptimized={isCmsHostedMediaUrl(initiative.featuredImage)} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />

        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5">
          <Link href={`/${locale}/initiatives-campaigns`} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-500 hover:bg-white text-xs font-bold px-4 py-2 rounded-full border border-neutral-200 transition-all group shadow-sm">
            <ArrowBack className="w-3.5 h-3.5" />
            {isRTL ? 'جميع المبادرات' : 'All Initiatives'}
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 container-wide pb-10 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cat.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} ${ongoing ? 'animate-pulse' : ''}`} />
              {cat[isRTL ? 'ar' : 'en']}
            </div>
          </div>
          <h1 className="text-primary-900 text-3xl md:text-5xl font-black leading-tight max-w-3xl">{initiative.title[locale]}</h1>
          <p className="text-neutral-600 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">{initiative.shortDescription[locale]}</p>
        </div>
      </div>

      {/* Sticky nav */}
      <div className="sticky top-10 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[
            { label: isRTL ? 'الوصف' : 'Description', href: '#description' },
            { label: isRTL ? 'الهدف' : 'Objective',   href: '#objective' },
            { label: isRTL ? 'المخرجات' : 'Outputs',  href: '#outputs' },
            { label: isRTL ? 'الصور' : 'Gallery',     href: '#gallery' },
          ].map((ch, i) => (
            <a key={i} href={ch.href} className="flex items-center gap-1.5 px-5 py-4 text-xs font-black text-neutral-400 hover:text-primary-500 border-b-2 border-transparent hover:border-primary-500 transition-all whitespace-nowrap shrink-0">
              <Chevron className="w-3 h-3" />
              {ch.label}
            </a>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <div id="description" className="scroll-mt-24 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                    <Megaphone className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'عن النشاط' : 'About'}</h2>
                </div>
                <CmsRichText
                  html={initiative.description[locale]}
                  className="text-neutral-600 leading-relaxed"
                />
              </div>

              <div id="objective" className="scroll-mt-24 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                    <Target className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'الهدف' : 'Objective'}</h2>
                </div>
                <p className="text-neutral-600 leading-relaxed">{initiative.objective[locale]}</p>
              </div>

              <div id="outputs" className="scroll-mt-24 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المخرجات' : 'Outputs'}</h2>
                </div>
                <div className="space-y-3">
                  {initiative.outputs.map((output, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl border border-neutral-100 hover:border-primary-100 hover:bg-primary-50/30 transition-colors">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white" style={{ backgroundColor: cat.color }}>
                        {i + 1}
                      </div>
                      <p className="text-neutral-700 text-sm leading-relaxed">{output[locale]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(initiative.images.length > 0 || (initiative.videos && initiative.videos.length > 0)) && (
                <div id="gallery" className="scroll-mt-24 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                  <h2 className="text-xl font-black text-primary-900 mb-5">{isRTL ? 'الصور والفيديو' : 'Media'}</h2>
                  {initiative.videos && initiative.videos.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-5">
                      {initiative.videos.map((url, i) => (
                        <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
                          <iframe src={url} title={`video ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
                        </div>
                      ))}
                    </div>
                  )}
                  {initiative.images.length > 0 && (
                    <ProjectGallery
                      images={initiative.images}
                      alt={initiative.title[locale]}
                      variant="light"
                      isRTL={isRTL}
                    />
                  )}
                </div>
              )}

              {relatedProject && (
                <div className="scroll-mt-24 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                      <FolderOpen className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المشروع المرتبط' : 'Related Project'}</h2>
                  </div>
                  <Link href={`/${locale}/programs-projects/${relatedProject.slug}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                      <Image src={relatedProject.featuredImage} alt={relatedProject.title[locale]} fill className="object-cover" sizes="80px" unoptimized={isCmsHostedMediaUrl(relatedProject.featuredImage)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-primary-900 text-sm leading-tight">{relatedProject.title[locale]}</p>
                      <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{relatedProject.shortDescription[locale]}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 shrink-0 transition-colors" />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm sticky top-12">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-4">{isRTL ? 'معلومات النشاط' : 'Activity Info'}</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'النوع' : 'Type'}</span>
                    <div className={`mt-1 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cat.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      {cat[isRTL ? 'ar' : 'en']}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'الحالة' : 'Status'}</span>
                    <p className="text-sm font-black mt-1" style={{ color: ongoing ? '#10b981' : '#888' }}>
                      {ongoing ? (isRTL ? '🟢 جارٍ' : '🟢 Ongoing') : (isRTL ? '⚪ منتهي' : '⚪ Ended')}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'تاريخ البدء' : 'Start Date'}</span>
                    <p className="text-sm font-bold text-primary-500 mt-1">{fmtDate(initiative.startDate)}</p>
                  </div>
                  {initiative.endDate && (
                    <div>
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</span>
                      <p className="text-sm font-bold text-primary-500 mt-1">{fmtDate(initiative.endDate)}</p>
                    </div>
                  )}
                  {reachDisplay && (
                    <div>
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'الوصول' : 'Reach'}</span>
                      <p className="text-sm font-bold text-primary-500 mt-1">{reachDisplay}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{isRTL ? 'عدد المخرجات' : 'Outputs'}</span>
                    <p className="text-2xl font-black text-primary-500 mt-1">{initiative.outputs.length}</p>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <Link href={`/${locale}/initiatives-campaigns`} className="flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors">
                    <ArrowBack className="w-4 h-4" />
                    {isRTL ? 'العودة' : 'Go Back'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current="light" isRTL={isRTL} />
    </>
  )

  /* ─────────────────────────────────────────────
     CLASSIC VARIANT
  ───────────────────────────────────────────── */
  return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-primary-900">
        <Image src={initiative.featuredImage} alt={initiative.title[locale]} fill className="object-cover opacity-40" priority sizes="100vw" unoptimized={isCmsHostedMediaUrl(initiative.featuredImage)} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end container-wide pb-10">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border w-fit mb-4 ${cat.dark}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} ${ongoing ? 'animate-pulse' : ''}`} />
            {cat[isRTL ? 'ar' : 'en']}
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl">{initiative.title[locale]}</h1>
        </div>
      </div>

      {/* Main */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute top-1/3 -end-24 w-80 h-80 rounded-full bg-secondary-100/30 blur-3xl" />
        </div>
        <div className="relative container-wide py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Back */}
              <Link href={`/${locale}/initiatives-campaigns`} className="inline-flex items-center gap-2 text-primary-500 hover:text-secondary-500 transition-colors text-sm font-bold">
                <ArrowBack className="w-4 h-4" />
                {isRTL ? 'جميع المبادرات' : 'All Initiatives'}
              </Link>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <Megaphone className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'عن النشاط' : 'About'}</h2>
                </div>
                <CmsRichText
                  html={initiative.description[locale]}
                  className="text-neutral-600 leading-relaxed"
                />
              </div>

              {/* Objective */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <Target className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'الهدف' : 'Objective'}</h2>
                </div>
                <p className="text-neutral-600 leading-relaxed">{initiative.objective[locale]}</p>
              </div>

              {/* Outputs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المخرجات' : 'Outputs'}</h2>
                </div>
                <ol className="space-y-4">
                  {initiative.outputs.map((output, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md" style={{ backgroundColor: cat.color }}>
                          {i + 1}
                        </div>
                        {i < initiative.outputs.length - 1 && <div className="w-0.5 flex-1 min-h-[20px] rounded-full" style={{ backgroundColor: cat.color + '30' }} />}
                      </div>
                      <div className="pb-4">
                        <p className="text-neutral-700 leading-relaxed">{output[locale]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Gallery */}
              {(initiative.images.length > 0 || (initiative.videos && initiative.videos.length > 0)) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                  <h2 className="text-xl font-black text-primary-900 mb-5">{isRTL ? 'الصور والفيديو' : 'Media'}</h2>
                  {initiative.videos && initiative.videos.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-5">
                      {initiative.videos.map((url, i) => (
                        <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
                          <iframe src={url} title={`video ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
                        </div>
                      ))}
                    </div>
                  )}
                  {initiative.images.length > 0 && (
                    <ProjectGallery
                      images={initiative.images}
                      alt={initiative.title[locale]}
                      variant="classic"
                      isRTL={isRTL}
                    />
                  )}
                </div>
              )}

              {/* Related Project */}
              {relatedProject && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                      <FolderOpen className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المشروع المرتبط' : 'Related Project'}</h2>
                  </div>
                  <Link href={`/${locale}/programs-projects/${relatedProject.slug}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                      <Image src={relatedProject.featuredImage} alt={relatedProject.title[locale]} fill className="object-cover" sizes="80px" unoptimized={isCmsHostedMediaUrl(relatedProject.featuredImage)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-primary-900 text-sm leading-tight">{relatedProject.title[locale]}</p>
                      <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{relatedProject.shortDescription[locale]}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors" />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-12">
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 bg-neutral-100 relative">
                  <Image src={initiative.featuredImage} alt={initiative.title[locale]} fill className="object-cover" sizes="400px" unoptimized={isCmsHostedMediaUrl(initiative.featuredImage)} />
                </div>
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-4">{isRTL ? 'تفاصيل النشاط' : 'Details'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 font-medium">{isRTL ? 'النوع' : 'Type'}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cat.badge}`}>{cat[isRTL ? 'ar' : 'en']}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 font-medium">{isRTL ? 'الحالة' : 'Status'}</span>
                    <span className={`font-bold ${ongoing ? 'text-green-600' : 'text-neutral-400'}`}>
                      {ongoing ? (isRTL ? 'جارٍ' : 'Ongoing') : (isRTL ? 'منتهي' : 'Ended')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{isRTL ? 'البداية' : 'Start'}</span>
                    <span className="font-bold text-primary-500">{fmtDate(initiative.startDate)}</span>
                  </div>
                  {initiative.endDate && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-neutral-400 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{isRTL ? 'النهاية' : 'End'}</span>
                      <span className="font-bold text-primary-500">{fmtDate(initiative.endDate)}</span>
                    </div>
                  )}
                  {reachDisplay && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-neutral-400 font-medium">{isRTL ? 'الوصول' : 'Reach'}</span>
                      <span className="font-bold text-primary-500">{reachDisplay}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 pt-2 border-t border-neutral-100">
                    <span className="text-neutral-400 font-medium">{isRTL ? 'المخرجات' : 'Outputs'}</span>
                    <span className="text-2xl font-black text-primary-500">{initiative.outputs.length}</span>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <Link href={`/${locale}/initiatives-campaigns`} className="flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors">
                    <ArrowBack className="w-4 h-4" />
                    {isRTL ? 'العودة إلى المبادرات' : 'Back to Initiatives'}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current="classic" isRTL={isRTL} />
    </>
  )
}
