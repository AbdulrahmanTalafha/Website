import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildBreadcrumbSchema, buildMetadata, buildPublicationSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getPublicationBySlug } from '@/lib/api'
import { publicationsData } from '@/data/publications'
import {
  Calendar, Download, FileText, ArrowLeft, ArrowRight,
  BookOpen, Microscope, FileBarChart2, BookMarked, Newspaper,
  User, Tag, Hash,
} from 'lucide-react'
import DesignSwitcher from '@/components/projects/DesignSwitcher'

interface PublicationDetailProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export async function generateStaticParams() {
  return publicationsData.flatMap(p =>
    ['ar', 'en'].map(locale => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({ params, searchParams }: PublicationDetailProps): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const { v } = await searchParams
  const pub = await getPublicationBySlug(locale, slug)
  if (!pub) return {}
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/publications-reports/${slug}`,
    customTitle: pub.title[locale],
    customDescription: pub.summary[locale],
    noIndex: Boolean(v),
  })
}

const TYPE = {
  'report':       { ar: 'تقرير',        en: 'Report',       icon: FileBarChart2, badge: 'bg-blue-50 text-blue-700 border-blue-200',     dark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',       color: '#3b82f6' },
  'study':        { ar: 'دراسة',        en: 'Study',        icon: Microscope,    badge: 'bg-purple-50 text-purple-700 border-purple-200', dark: 'bg-purple-500/20 text-purple-300 border-purple-500/30', color: '#8b5cf6' },
  'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper', icon: FileText,      badge: 'bg-amber-50 text-amber-700 border-amber-200',    dark: 'bg-amber-500/20 text-amber-300 border-amber-500/30',    color: '#f59e0b' },
  'guide':        { ar: 'دليل',         en: 'Guide',        icon: BookOpen,      badge: 'bg-sky-50 text-sky-700 border-sky-200',          dark: 'bg-sky-500/20 text-sky-300 border-sky-500/30',          color: '#0ea5e9' },
  'brief':        { ar: 'موجز',         en: 'Brief',        icon: Newspaper,     badge: 'bg-rose-50 text-rose-700 border-rose-200',       dark: 'bg-rose-500/20 text-rose-300 border-rose-500/30',       color: '#f43f5e' },
} as const

type PubType = keyof typeof TYPE

/* ── Shared: Related materials renderer ── */
function RelatedMaterials({ pub, locale, cardCls, textCls }: {
  pub: (typeof publicationsData)[0],
  locale: Locale,
  cardCls: string,
  textCls: string,
}) {
  if (!pub.relatedMaterials?.length) return null
  const related = pub.relatedMaterials
    .map(id => publicationsData.find(p => p.id === id))
    .filter((p): p is (typeof publicationsData)[0] => Boolean(p))
  if (!related.length) return null
  const isRTL = locale === 'ar'
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {related.map(r => {
        const rt = TYPE[r.type as PubType] ?? TYPE['report']
        const RIcon = rt.icon
        return (
          <Link key={r.id} href={`/${locale}/publications-reports/${r.slug}`} className={`group flex items-center gap-3 rounded-2xl p-4 transition-all ${cardCls}`}>
            <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
              <Image src={r.coverImage} alt={r.title[locale]} fill className="object-cover" sizes="48px" />
              <div className="absolute top-0 start-0 bottom-0 w-1 rounded-s-lg" style={{ backgroundColor: rt.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <RIcon className="w-3 h-3 shrink-0" style={{ color: rt.color }} />
                <span className="text-xs font-bold" style={{ color: rt.color }}>{isRTL ? rt.ar : rt.en}</span>
              </div>
              <p className={`text-xs font-bold line-clamp-2 transition-colors group-hover:text-secondary-500 ${textCls}`}>{r.title[locale]}</p>
              <p className="text-neutral-400 text-xs mt-0.5">{r.publishDate.slice(0, 4)}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function PublicationDetailPage({ params, searchParams }: PublicationDetailProps) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  await searchParams
  const variant = 'classic' as 'dark' | 'light' | 'classic'

  const pub = await getPublicationBySlug(locale, slug)
  if (!pub) notFound()

  const isRTL = locale === 'ar'
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const t = TYPE[pub.type as PubType] ?? TYPE['report']
  const TypeIcon = t.icon

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  const basePath    = `/${locale}/publications-reports/${slug}`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`
  const pdfUrl = pub.pdfUrl.startsWith('http') ? pub.pdfUrl : `${BASE_URL}${pub.pdfUrl}`
  const schemas = [
    buildBreadcrumbSchema([
      { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
      { name: isRTL ? 'المنشورات والتقارير' : 'Publications & Reports', url: `${BASE_URL}/${locale}/publications-reports` },
      { name: pub.title[locale], url: `${BASE_URL}/${locale}/publications-reports/${slug}` },
    ]),
    buildPublicationSchema({
      title: pub.title[locale],
      description: pub.summary[locale],
      datePublished: pub.publishDate,
      pdfUrl,
      locale,
    }),
  ]

  /* ─────────────────────────────────────────────
     DARK VARIANT (default)
  ───────────────────────────────────────────── */
  if (variant === 'dark') return (
    <>
      <JsonLd data={schemas} />

      <div className="relative min-h-[60vh] overflow-hidden bg-primary-900 flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 opacity-10">
          <Image src={pub.coverImage} alt="" fill className="object-cover blur-2xl scale-110" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${t.color}15 0%, transparent 70%)` }} />
        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5">
          <Link href={`/${locale}/publications-reports`} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 transition-all group">
            <ArrowBack className="w-3.5 h-3.5" />
            {isRTL ? 'جميع المنشورات' : 'All Publications'}
          </Link>
        </div>
        <div className="relative z-10 container-wide pb-12 pt-24 flex flex-col md:flex-row gap-10 items-end">
          <div className="relative w-44 h-60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 shrink-0 border border-white/10">
            <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover" sizes="176px" />
            <div className="absolute top-0 start-0 bottom-0 w-3 opacity-30" style={{ background: `linear-gradient(to end, transparent, white)` }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${t.dark}`}>
                <TypeIcon className="w-3.5 h-3.5" />{isRTL ? t.ar : t.en}
              </div>
              {pub.pages && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/60 border border-white/20">
                  <FileText className="w-3.5 h-3.5" />{pub.pages} {isRTL ? 'صفحة' : 'pages'}
                </div>
              )}
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight max-w-3xl mb-3">{pub.title[locale]}</h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-5">{pub.summary[locale]}</p>
            {pub.pdfUrl && (
              <a href={pub.pdfUrl} download className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-black px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-secondary-500/30">
                <Download className="w-4 h-4" />{isRTL ? 'تحميل PDF' : 'Download PDF'}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-10 z-30 bg-primary-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[isRTL ? 'الملخص' : 'Summary', isRTL ? 'المؤلفون' : 'Authors', isRTL ? 'الوسوم' : 'Tags'].map((label, i) => (
            <a key={i} href={`#section-${i}`} className="px-5 py-4 text-xs font-black text-white/40 hover:text-white border-b-2 border-transparent hover:border-secondary-400 transition-all whitespace-nowrap shrink-0">{label}</a>
          ))}
        </div>
      </div>

      <div className="bg-primary-900 min-h-screen">
        <div className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div id="section-0" className="scroll-mt-24">
                <h2 className="text-lg font-black text-white mb-4">{isRTL ? 'ملخص المنشور' : 'Summary'}</h2>
                <p className="text-white/70 leading-relaxed">{pub.summary[locale]}</p>
              </div>
              {pub.authors && pub.authors.length > 0 && (
                <div id="section-1" className="scroll-mt-24">
                  <h2 className="text-lg font-black text-white mb-4">{isRTL ? 'المؤلفون' : 'Authors'}</h2>
                  <div className="flex flex-wrap gap-3">
                    {pub.authors.map((author, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: t.color }}>{author[locale].charAt(0)}</div>
                        <span className="text-white/80 text-sm font-bold">{author[locale]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pub.tags.length > 0 && (
                <div id="section-2" className="scroll-mt-24">
                  <h2 className="text-lg font-black text-white mb-4">{isRTL ? 'الوسوم' : 'Tags'}</h2>
                  <div className="flex flex-wrap gap-2">
                    {pub.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-sm text-white/60 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                        <Hash className="w-3 h-3" style={{ color: t.color }} />{tag[locale]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pub.relatedMaterials && pub.relatedMaterials.length > 0 && (
                <div className="scroll-mt-24">
                  <h2 className="text-lg font-black text-white mb-4">{isRTL ? 'مواد ذات صلة' : 'Related Materials'}</h2>
                  <RelatedMaterials pub={pub} locale={locale} cardCls="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10" textCls="text-white/80" />
                </div>
              )}
            </div>
            <div>
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-wider mb-5">{isRTL ? 'بيانات المنشور' : 'Publication Info'}</h3>
                <div className="space-y-4 text-sm">
                  {[
                    { label: isRTL ? 'النوع' : 'Type', value: <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${t.dark}`}><TypeIcon className="w-3 h-3" />{isRTL ? t.ar : t.en}</span> },
                    { label: isRTL ? 'تاريخ النشر' : 'Published', value: <span className="text-white/60 font-bold">{fmtDate(pub.publishDate)}</span> },
                    ...(pub.pages ? [{ label: isRTL ? 'الصفحات' : 'Pages', value: <span className="text-2xl font-black text-white">{pub.pages}</span> }] : []),
                    ...(pub.authors?.length ? [{ label: isRTL ? 'المؤلفون' : 'Authors', value: <span className="text-white/60">{pub.authors.map(a => a[locale]).join('، ')}</span> }] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 py-3 border-b border-white/10 last:border-0">
                      <span className="text-white/40 font-medium shrink-0">{item.label}</span>
                      <div className="text-end">{item.value}</div>
                    </div>
                  ))}
                </div>
                {pub.pdfUrl && (
                  <a href={pub.pdfUrl} download className="mt-5 flex items-center justify-center gap-2 w-full bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-black py-3 rounded-2xl transition-colors">
                    <Download className="w-4 h-4" />{isRTL ? 'تحميل PDF' : 'Download PDF'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current="dark" isRTL={isRTL} />
    </>
  )

  /* ─────────────────────────────────────────────
     LIGHT VARIANT — same structure as dark, light palette
  ───────────────────────────────────────────── */
  if (variant === 'light') return (
    <>
      <JsonLd data={schemas} />

      {/* Hero — light version of dark */}
      <div className="relative min-h-[55vh] overflow-hidden flex items-end" style={{ background: `linear-gradient(135deg, #f8f9ff 0%, #ffffff 40%, #f9f9ff 100%)` }}>
        <div className="absolute inset-0 opacity-8">
          <Image src={pub.coverImage} alt="" fill className="object-cover blur-3xl scale-110" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 40%, ${t.color}12 0%, transparent 65%)` }} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -start-20 w-80 h-80 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute top-1/3 -end-16 w-72 h-72 rounded-full bg-secondary-100/20 blur-3xl" />
        </div>
        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5">
          <Link href={`/${locale}/publications-reports`} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-500 hover:bg-white text-xs font-bold px-4 py-2 rounded-full border border-neutral-200 transition-all shadow-sm">
            <ArrowBack className="w-3.5 h-3.5" />
            {isRTL ? 'جميع المنشورات' : 'All Publications'}
          </Link>
        </div>
        <div className="relative z-10 container-wide pb-12 pt-24 flex flex-col md:flex-row gap-10 items-end">
          <div className="relative w-44 h-60 rounded-2xl overflow-hidden shadow-2xl shadow-primary-200/60 shrink-0 border border-neutral-200">
            <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover" sizes="176px" />
            <div className="absolute top-0 start-0 bottom-0 w-3" style={{ background: `linear-gradient(to end, ${t.color}60, transparent)` }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${t.badge}`}>
                <TypeIcon className="w-3.5 h-3.5" />{isRTL ? t.ar : t.en}
              </div>
              {pub.pages && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-neutral-500 border border-neutral-200 shadow-sm">
                  <FileText className="w-3.5 h-3.5" />{pub.pages} {isRTL ? 'صفحة' : 'pages'}
                </div>
              )}
            </div>
            <h1 className="text-primary-900 text-3xl md:text-4xl font-black leading-tight max-w-3xl mb-3">{pub.title[locale]}</h1>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-2xl mb-5">{pub.summary[locale]}</p>
            {pub.pdfUrl && (
              <a href={pub.pdfUrl} download className="inline-flex items-center gap-2 text-white text-sm font-black px-5 py-2.5 rounded-full transition-colors shadow-lg" style={{ backgroundColor: t.color }}>
                <Download className="w-4 h-4" />{isRTL ? 'تحميل PDF' : 'Download PDF'}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-10 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[isRTL ? 'الملخص' : 'Summary', isRTL ? 'المؤلفون' : 'Authors', isRTL ? 'الوسوم' : 'Tags'].map((label, i) => (
            <a key={i} href={`#section-${i}`} className="px-5 py-4 text-xs font-black text-neutral-400 hover:text-primary-500 border-b-2 border-transparent hover:border-primary-500 transition-all whitespace-nowrap shrink-0">{label}</a>
          ))}
        </div>
      </div>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 40%, #fff8f8 70%, #f9f9ff 100%)' }}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-32 -start-20 w-80 h-80 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute top-1/2 -end-20 w-96 h-96 rounded-full bg-secondary-100/20 blur-3xl" />
        </div>
        <div className="relative z-10 container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div id="section-0" className="scroll-mt-24">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3" style={{ color: t.color }}>
                  <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: t.color }} />
                  {isRTL ? 'ملخص المنشور' : 'Summary'}
                </div>
                <p className="text-neutral-700 leading-relaxed text-base">{pub.summary[locale]}</p>
              </div>
              {pub.authors && pub.authors.length > 0 && (
                <div id="section-1" className="scroll-mt-24">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4" style={{ color: t.color }}>
                    <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {isRTL ? 'المؤلفون' : 'Authors'}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {pub.authors.map((author, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-neutral-100 shadow-sm">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: t.color }}>{author[locale].charAt(0)}</div>
                        <span className="text-primary-900 text-sm font-bold">{author[locale]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pub.tags.length > 0 && (
                <div id="section-2" className="scroll-mt-24">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4" style={{ color: t.color }}>
                    <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {isRTL ? 'الوسوم' : 'Tags'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pub.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border" style={{ color: t.color, borderColor: t.color + '40', backgroundColor: t.color + '10' }}>
                        <Hash className="w-3 h-3" />{tag[locale]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pub.relatedMaterials && pub.relatedMaterials.length > 0 && (
                <div className="scroll-mt-24">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4" style={{ color: t.color }}>
                    <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {isRTL ? 'مواد ذات صلة' : 'Related Materials'}
                  </div>
                  <RelatedMaterials pub={pub} locale={locale} cardCls="bg-white border border-neutral-100 hover:border-primary-200 hover:shadow-md" textCls="text-primary-900" />
                </div>
              )}
            </div>
            <div>
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm sticky top-24">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-5 bg-neutral-100 relative">
                  <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover" sizes="300px" />
                  <div className="absolute top-0 start-0 bottom-0 w-2 rounded-s-xl" style={{ backgroundColor: t.color }} />
                </div>
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-4">{isRTL ? 'بيانات المنشور' : 'Publication Info'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2 items-center">
                    <span className="text-neutral-400">{isRTL ? 'النوع' : 'Type'}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${t.badge}`}>{isRTL ? t.ar : t.en}</span>
                  </div>
                  <div className="flex justify-between gap-2 items-center">
                    <span className="text-neutral-400">{isRTL ? 'تاريخ النشر' : 'Published'}</span>
                    <span className="font-bold text-primary-500 text-xs text-end">{fmtDate(pub.publishDate)}</span>
                  </div>
                  {pub.pages && (
                    <div className="flex justify-between gap-2 items-center pt-2 border-t border-neutral-100">
                      <span className="text-neutral-400">{isRTL ? 'الصفحات' : 'Pages'}</span>
                      <span className="text-xl font-black text-primary-500">{pub.pages}</span>
                    </div>
                  )}
                  {pub.authors?.length && (
                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-neutral-400 text-xs block mb-2">{isRTL ? 'المؤلفون' : 'Authors'}</span>
                      <p className="font-bold text-primary-900 text-sm">{pub.authors.map(a => a[locale]).join('، ')}</p>
                    </div>
                  )}
                </div>
                {pub.pdfUrl && (
                  <a href={pub.pdfUrl} download className="mt-5 flex items-center justify-center gap-2 w-full text-white text-sm font-black py-3 rounded-2xl transition-all hover:opacity-90" style={{ backgroundColor: t.color }}>
                    <Download className="w-4 h-4" />{isRTL ? 'تحميل PDF' : 'Download PDF'}
                  </a>
                )}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <Link href={`/${locale}/publications-reports`} className="flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors">
                    <ArrowBack className="w-4 h-4" />
                    {isRTL ? 'العودة إلى المنشورات' : 'Back to Publications'}
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
     CLASSIC VARIANT — initiatives style
  ───────────────────────────────────────────── */
  return (
    <>
      <JsonLd data={schemas} />

      {/* Full-width hero with cover image background */}
      <div className="relative h-80 md:h-[420px] overflow-hidden bg-primary-900">
        <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover opacity-35" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 60% 80%, ${t.color}20 0%, transparent 60%)` }} />
        <div className="absolute inset-0 flex flex-col justify-end container-wide pb-10">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border w-fit mb-4 ${t.dark}`}>
            <TypeIcon className="w-3.5 h-3.5" />
            {isRTL ? t.ar : t.en}
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl">{pub.title[locale]}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 min-h-screen">
        {/* Floating blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute top-1/3 -end-24 w-80 h-80 rounded-full bg-secondary-100/30 blur-3xl" />
          <div className="absolute bottom-20 start-1/4 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: t.color + '08' }} />
        </div>
        <div className="relative container-wide py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Content column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Back link */}
              <Link href={`/${locale}/publications-reports`} className="inline-flex items-center gap-2 text-primary-500 hover:text-secondary-500 transition-colors text-sm font-bold">
                <ArrowBack className="w-4 h-4" />
                {isRTL ? 'جميع المنشورات' : 'All Publications'}
              </Link>

              {/* Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: t.color + '20' }}>
                    <BookMarked className="w-5 h-5" style={{ color: t.color }} />
                  </div>
                  <h2 className="text-xl font-black text-primary-900">{isRTL ? 'ملخص المنشور' : 'Summary'}</h2>
                </div>
                <p className="text-neutral-600 leading-relaxed">{pub.summary[locale]}</p>
              </div>

              {/* Authors */}
              {pub.authors && pub.authors.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: t.color + '20' }}>
                      <User className="w-5 h-5" style={{ color: t.color }} />
                    </div>
                    <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المؤلفون' : 'Authors'}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {pub.authors.map((author, i) => (
                      <div key={i} className="flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-100">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0" style={{ backgroundColor: t.color }}>{author[locale].charAt(0)}</div>
                        <span className="font-bold text-primary-900 text-sm">{author[locale]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {pub.tags.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: t.color + '20' }}>
                      <Tag className="w-5 h-5" style={{ color: t.color }} />
                    </div>
                    <h2 className="text-xl font-black text-primary-900">{isRTL ? 'المواضيع' : 'Topics'}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pub.tags.map((tag, i) => (
                      <span key={i} className="text-sm px-4 py-2 rounded-full border font-semibold" style={{ color: t.color, borderColor: t.color + '40', backgroundColor: t.color + '08' }}>{tag[locale]}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Materials */}
              {pub.relatedMaterials && pub.relatedMaterials.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: t.color + '20' }}>
                      <BookOpen className="w-5 h-5" style={{ color: t.color }} />
                    </div>
                    <h2 className="text-xl font-black text-primary-900">{isRTL ? 'مواد ذات صلة' : 'Related Materials'}</h2>
                  </div>
                  <RelatedMaterials pub={pub} locale={locale} cardCls="bg-white rounded-2xl border border-neutral-100 hover:border-secondary-200 hover:shadow-lg" textCls="text-primary-900" />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-12">
                {/* Book cover */}
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-5 bg-neutral-100 relative shadow-md">
                  <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover" sizes="300px" />
                  <div className="absolute top-0 start-0 bottom-0 w-2 rounded-s-xl" style={{ backgroundColor: t.color }} />
                </div>
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-4">{isRTL ? 'بيانات المنشور' : 'Details'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 font-medium">{isRTL ? 'النوع' : 'Type'}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${t.badge}`}>{isRTL ? t.ar : t.en}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-neutral-400 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{isRTL ? 'تاريخ النشر' : 'Published'}</span>
                    <span className="font-bold text-primary-500 text-xs text-end">{fmtDate(pub.publishDate)}</span>
                  </div>
                  {pub.pages && (
                    <div className="flex items-start justify-between gap-2 pt-2 border-t border-neutral-100">
                      <span className="text-neutral-400 font-medium">{isRTL ? 'الصفحات' : 'Pages'}</span>
                      <span className="text-2xl font-black text-primary-500">{pub.pages}</span>
                    </div>
                  )}
                  {pub.authors?.length && (
                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-neutral-400 text-xs block mb-2">{isRTL ? 'المؤلفون' : 'Authors'}</span>
                      <p className="font-bold text-primary-900 text-sm">{pub.authors.map(a => a[locale]).join('، ')}</p>
                    </div>
                  )}
                </div>
                {pub.pdfUrl && (
                  <a href={pub.pdfUrl} download className="mt-5 flex items-center justify-center gap-2 w-full text-white text-sm font-black py-3 rounded-2xl transition-all hover:opacity-90" style={{ backgroundColor: t.color }}>
                    <Download className="w-4 h-4" />{isRTL ? 'تحميل PDF' : 'Download PDF'}
                  </a>
                )}
                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <Link href={`/${locale}/publications-reports`} className="flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors">
                    <ArrowBack className="w-4 h-4" />
                    {isRTL ? 'العودة إلى المنشورات' : 'Back to Publications'}
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
