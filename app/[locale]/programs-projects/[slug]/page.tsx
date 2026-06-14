import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildArticleSchema, buildBreadcrumbSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getProjectBySlug, getNews, getPublications } from '@/lib/api'
import { projectsData } from '@/data/projects'
import {
  Calendar, MapPin, Building2, Users, CheckCircle2, ChevronRight,
  ArrowLeft, ArrowRight, Newspaper, BookOpen, ExternalLink,
  Quote, Sparkles, Heart, Globe, Clock, Target,
} from 'lucide-react'
import DesignSwitcher from '@/components/projects/DesignSwitcher'

interface ProjectDetailProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export async function generateStaticParams() {
  return projectsData.flatMap(p =>
    ['ar', 'en'].map(locale => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({ params, searchParams }: ProjectDetailProps): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const { v } = await searchParams
  const project = await getProjectBySlug(locale, slug)
  if (!project) return {}
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/programs-projects/${slug}`,
    customTitle: project.title[locale],
    customDescription: project.shortDescription[locale],
    noIndex: Boolean(v),
    ogType: 'article',
  })
}

const statusConfig = {
  active:    { light: 'bg-green-50 text-green-700 border-green-200',        dark: 'bg-green-500/20 text-green-300 border-green-500/30', dot: 'bg-green-500 animate-pulse', ar: 'نشط',    en: 'Active' },
  completed: { light: 'bg-neutral-100 text-neutral-500 border-neutral-200', dark: 'bg-white/10 text-white/60 border-white/20',          dot: 'bg-neutral-400',             ar: 'مكتمل', en: 'Completed' },
  upcoming:  { light: 'bg-blue-50 text-blue-600 border-blue-200',           dark: 'bg-blue-500/20 text-blue-200 border-blue-500/30',    dot: 'bg-blue-500',                ar: 'قادم',   en: 'Upcoming' },
}

const chapterAccents = ['bg-primary-500', 'bg-secondary-500', 'bg-primary-400', 'bg-secondary-400']
const chapterBorders = ['border-primary-200', 'border-secondary-200', 'border-primary-200', 'border-secondary-200']

export default async function ProjectDetailPage({ params, searchParams }: ProjectDetailProps) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  await searchParams
  const variant = 'classic' as 'dark' | 'light' | 'classic'

  const projectRaw = await getProjectBySlug(locale, slug)
  if (!projectRaw) notFound()
  const project = projectRaw!

  const isRTL = locale === 'ar'
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const status = statusConfig[project.status]

  const [allNews, allPubs] = await Promise.all([getNews(locale), getPublications(locale)])
  const relatedNews = allNews.filter(n => project.relatedNews?.includes(n.id))
  const relatedPubs = allPubs.filter(p => project.relatedPublications?.includes(p.id))

  const startDate = new Date(project.startDate)
  const endDate   = new Date(project.endDate)
  const months    = Math.round((endDate.getTime() - startDate.getTime()) / (1000*60*60*24*30))
  const fmtDate   = (d: Date) => d.toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })

  const genderLabel =
    project.genderClassification === 'mixed'  ? (isRTL ? 'ذكور وإناث' : 'Mixed') :
    project.genderClassification === 'female' ? (isRTL ? 'إناث'        : 'Female') :
    project.genderClassification === 'male'   ? (isRTL ? 'ذكور'        : 'Male') :
    (isRTL ? 'شباب' : 'Youth')

  const basePath    = `/${locale}/programs-projects/${slug}`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`
  const schemas = [
    buildBreadcrumbSchema([
      { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
      { name: isRTL ? 'البرامج والمشاريع' : 'Programs & Projects', url: `${BASE_URL}/${locale}/programs-projects` },
      { name: project.title[locale], url: `${BASE_URL}/${locale}/programs-projects/${slug}` },
    ]),
    buildArticleSchema({
      title: project.title[locale],
      description: project.shortDescription[locale],
      datePublished: project.startDate,
      image: project.featuredImage,
      locale,
    }),
  ]

  /* ─────────────────────────────────────────────
     DARK VARIANT (default)
  ───────────────────────────────────────────── */
  if (variant === 'dark') return (
    <>
      <JsonLd data={schemas} />

      {/* ═══ HERO ═══ */}
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden bg-primary-900">
        <Image src={project.featuredImage} alt={project.title[locale]} fill className="object-cover opacity-40" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 to-transparent" />

        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5 flex items-center justify-between">
          <Link href={`/${locale}/programs-projects`} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 transition-all group">
            <ArrowBack className="w-3.5 h-3.5 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
            {isRTL ? 'جميع المشاريع' : 'All Projects'}
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 container-wide pb-10 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.dark}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {isRTL ? status.ar : status.en}
            </div>
            <div className="bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
              {project.sector[locale]}
            </div>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight max-w-3xl">{project.title[locale]}</h1>
        </div>
      </div>

      {/* chapter nav */}
      <div className="sticky top-10 z-30 bg-primary-900/95 backdrop-blur-md border-b border-white/10">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[
            { num: '01', label: isRTL ? 'القصة' : 'Story',       href: '#chapter-1' },
            { num: '02', label: isRTL ? 'من نستهدف' : 'Audience', href: '#chapter-2' },
            { num: '03', label: isRTL ? 'النتائج' : 'Results',    href: '#chapter-3' },
            { num: '04', label: isRTL ? 'الموارد' : 'Resources',  href: '#chapter-4' },
          ].map(ch => (
            <a key={ch.num} href={ch.href} className="flex items-center gap-2 px-6 py-3.5 text-white/40 hover:text-white text-sm font-bold transition-colors border-e border-white/10 last:border-e-0 shrink-0 hover:bg-white/5 group">
              <span className="text-xs font-black text-white/15 group-hover:text-secondary-400 transition-colors">{ch.num}</span>
              {ch.label}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-primary-900 text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-32 -start-20 w-96 h-96 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute top-1/2 -end-20 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-32 start-1/3 w-72 h-72 rounded-full bg-secondary-500/5 blur-3xl" />
        </div>

        {/* ch 01 */}
        <section id="chapter-1" className="relative z-10">
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-sm">01</div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary-500/40 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-3 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-black uppercase tracking-widest mb-4">
                  <div className="w-6 h-0.5 bg-secondary-500 rounded-full" />
                  {isRTL ? 'عن المشروع' : 'About the Project'}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-5">{isRTL ? 'لماذا هذا المشروع؟' : 'Why this project?'}</h2>
                <p className="text-primary-100/70 text-base leading-loose">{project.fullDescription[locale]}</p>
              </div>
            </div>
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Quote className="w-7 h-7 text-secondary-400/60 mb-3" />
                <p className="text-white/80 text-sm font-semibold leading-relaxed italic line-clamp-5">&ldquo;{project.shortDescription[locale]}&rdquo;</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary-500/20 rounded-xl flex items-center justify-center shrink-0 border border-secondary-500/30">
                  <Heart className="w-4 h-4 text-secondary-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">{isRTL ? 'الجهة المانحة' : 'Funded by'}</p>
                  <p className="text-white font-black text-sm">{project.donor[locale]}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0 border border-primary-500/30">
                  <Calendar className="w-4 h-4 text-primary-300" />
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">{isRTL ? 'المدة' : 'Duration'}</p>
                  <p className="text-white font-black text-sm">{months} {isRTL ? 'شهر' : 'months'}</p>
                  <p className="text-xs text-white/30">{fmtDate(startDate)} — {fmtDate(endDate)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container-wide pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <MapPin className="w-5 h-5 text-secondary-400" />, value: project.governorates.length, label: isRTL ? 'محافظة' : 'Governorates', bg: 'bg-secondary-500/10 border-secondary-500/20' },
              { icon: <Calendar className="w-5 h-5 text-primary-300" />, value: months, label: isRTL ? 'شهر' : 'Months', bg: 'bg-primary-500/10 border-primary-500/20' },
              { icon: <CheckCircle2 className="w-5 h-5 text-secondary-400" />, value: project.keyResults.length, label: isRTL ? 'نتيجة' : 'Results', bg: 'bg-secondary-500/10 border-secondary-500/20' },
              { icon: <Building2 className="w-5 h-5 text-primary-300" />, value: '1', label: isRTL ? 'جهة مانحة' : 'Donor', bg: 'bg-primary-500/10 border-primary-500/20' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border rounded-2xl p-5 flex items-center gap-4`}>
                {s.icon}
                <div>
                  <div className="text-2xl font-black text-white leading-none">{s.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ch 02 */}
        <section id="chapter-2" className="relative z-10 bg-primary-800/50">
          <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-secondary-500 text-white flex items-center justify-center font-black text-sm">02</div>
              <div className="w-px flex-1 bg-gradient-to-b from-secondary-500/40 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-primary-400 rounded-full" />
                {isRTL ? 'الفئة المستهدفة' : 'Target Audience'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{isRTL ? 'من نستهدف؟' : 'Who do we reach?'}</h2>
              <p className="text-white/50 text-base mb-10 max-w-2xl leading-relaxed">{project.targetGroup[locale]}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: <Users className="w-5 h-5 text-primary-300" />, bg: 'bg-primary-500/20 border-primary-500/30', label: isRTL ? 'النوع الاجتماعي' : 'Gender', content: <p className="text-white text-xl font-black">{genderLabel}</p> },
                  { icon: <Globe className="w-5 h-5 text-secondary-400" />, bg: 'bg-secondary-500/20 border-secondary-500/30', label: isRTL ? 'الفئات العمرية' : 'Age Groups', content: <div className="flex flex-wrap gap-2">{project.ageGroups.map(ag => <span key={ag} className="bg-secondary-500/20 text-secondary-200 text-xs font-bold px-3 py-1.5 rounded-full border border-secondary-500/30">{ag === 'all' ? (isRTL ? 'جميع الأعمار' : 'All Ages') : ag}</span>)}</div> },
                  { icon: <MapPin className="w-5 h-5 text-primary-300" />, bg: 'bg-primary-500/20 border-primary-500/30', label: isRTL ? 'مواقع التنفيذ' : 'Locations', content: <div className="flex flex-wrap gap-1.5">{project.governorates.map(g => <span key={g} className="bg-primary-500/20 text-primary-200 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-500/30">{g}</span>)}</div> },
                ].map(card => (
                  <div key={card.label} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4 border`}>{card.icon}</div>
                    <p className="text-xs text-white/30 font-bold uppercase mb-3">{card.label}</p>
                    {card.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ch 03 */}
        <section id="chapter-3" className="relative z-10">
          <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-sm">03</div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary-500/40 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-primary-300 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-secondary-500 rounded-full" />
                {isRTL ? 'الأثر والنتائج' : 'Impact & Results'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{isRTL ? 'ماذا حققنا؟' : 'What did we achieve?'}</h2>
              <p className="text-white/30 mb-10">{project.keyResults.length} {isRTL ? 'نتيجة رئيسية' : 'key results'}</p>
              <div className="space-y-4 mb-12">
                {project.keyResults.map((result, i) => (
                  <div key={i} className="group bg-white/[0.04] rounded-2xl p-5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-start gap-4">
                    <div className={`shrink-0 w-9 h-9 rounded-xl ${chapterAccents[i % 4]} text-white flex items-center justify-center font-black text-xs`}>{String(i + 1).padStart(2, '0')}</div>
                    <p className="text-white/80 leading-relaxed text-sm pt-1">{result[locale]}</p>
                    <CheckCircle2 className="w-4 h-4 text-white/10 group-hover:text-secondary-400 transition-colors shrink-0 mt-1.5" />
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/10">
                <p className="text-xs text-white/30 font-bold uppercase mb-4">{isRTL ? 'الجدول الزمني' : 'Timeline'}</p>
                <div className="flex items-center gap-4">
                  <div><p className="text-xs text-white/30">{isRTL ? 'بداية' : 'Start'}</p><p className="text-white font-bold text-sm">{fmtDate(startDate)}</p></div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-500" style={{width: project.status === 'completed' ? '100%' : project.status === 'active' ? '60%' : '5%'}} />
                  </div>
                  <div className="text-end"><p className="text-xs text-white/30">{isRTL ? 'نهاية' : 'End'}</p><p className="text-white font-bold text-sm">{fmtDate(endDate)}</p></div>
                </div>
                <p className="text-center text-white/20 text-xs mt-3">{months} {isRTL ? 'شهر' : 'months'} · {project.donor[locale]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* gallery */}
        {project.images.length > 0 && (
          <section className="relative z-10 bg-primary-800/50">
            <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="container-wide py-16">
              <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-primary-400 rounded-full" />
                {isRTL ? 'لقطات من الميدان' : 'From the Field'}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.images.map((img, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden bg-primary-800 border border-white/10 ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} group`}>
                    <Image src={img} alt={`${project.title[locale]} ${i+1}`} fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" sizes="(max-width:768px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ch 04 */}
        {(relatedNews.length > 0 || relatedPubs.length > 0) && (
          <section id="chapter-4" className="relative z-10">
            <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
              <div className="hidden md:flex flex-col items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-2xl bg-secondary-500 text-white flex items-center justify-center font-black text-sm">04</div>
              </div>
              <div className="md:col-span-4">
                <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-black uppercase tracking-widest mb-4">
                  <div className="w-6 h-0.5 bg-primary-400 rounded-full" />
                  {isRTL ? 'الموارد والمواد' : 'Resources & Materials'}
                </div>
                <h2 className="text-2xl font-black text-white mb-10">{isRTL ? 'اقرأ أكثر' : 'Read More'}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedNews.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-xs text-white/30 font-bold uppercase mb-4"><Newspaper className="w-3.5 h-3.5" />{isRTL ? 'أخبار ذات صلة' : 'Related News'}</p>
                      {relatedNews.map(n => (
                        <Link key={n.id} href={`/${locale}/media-center/${n.slug}`} className="flex items-start gap-3 p-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group mb-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-primary-800"><Image src={n.image} alt={n.title[locale]} fill className="object-cover" sizes="56px" /></div>
                          <div><p className="text-xs text-white/30 mb-1">{new Date(n.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', {year:'numeric',month:'short'})}</p><p className="text-white text-sm font-bold group-hover:text-secondary-300 transition-colors line-clamp-2">{n.title[locale]}</p></div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {relatedPubs.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-xs text-white/30 font-bold uppercase mb-4"><BookOpen className="w-3.5 h-3.5" />{isRTL ? 'إصدارات ذات صلة' : 'Publications'}</p>
                      {relatedPubs.map(p => (
                        <Link key={p.id} href={`/${locale}/publications-reports/${p.slug}`} className="flex items-start gap-3 p-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group mb-3">
                          <div className="w-11 h-11 bg-secondary-500/20 rounded-xl flex items-center justify-center shrink-0 border border-secondary-500/30"><BookOpen className="w-4 h-4 text-secondary-400" /></div>
                          <div><p className="text-white text-sm font-bold group-hover:text-secondary-300 transition-colors line-clamp-2">{p.title[locale]}</p><p className="text-xs text-white/30 mt-1">{new Date(p.publishDate).getFullYear()}</p></div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative z-10">
          <div className="container-wide pb-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-600 p-10 md:p-14 text-center">
              <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'20px 20px'}} />
              <Sparkles className="w-9 h-9 text-white/40 mx-auto mb-5" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{isRTL ? 'هل تريد المشاركة أو الاستفسار؟' : 'Want to get involved?'}</h2>
              <p className="text-white/75 max-w-lg mx-auto mb-8 text-sm leading-relaxed">{isRTL ? 'تواصل معنا وسنكون سعداء بالرد على استفساراتك حول هذا المشروع.' : "Reach out and we'll be happy to tell you more."}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 bg-white text-primary-700 font-black px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm"><ExternalLink className="w-4 h-4" />{isRTL ? 'تواصل معنا' : 'Contact Us'}</Link>
                <Link href={`/${locale}/programs-projects`} className="inline-flex items-center gap-2 bg-white/15 text-white font-bold px-7 py-3 rounded-xl border border-white/25 hover:bg-white/25 transition-colors text-sm"><ArrowBack className="w-4 h-4" />{isRTL ? 'مشاريع أخرى' : 'More Projects'}</Link>
              </div>
            </div>
          </div>
        </section>
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

      {/* ═══ HERO ═══ */}
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <Image src={project.featuredImage} alt={project.title[locale]} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />

        <div className="absolute top-0 inset-x-0 z-10 container-wide pt-5 flex items-center justify-between">
          <Link href={`/${locale}/programs-projects`} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-600 hover:bg-white text-xs font-bold px-4 py-2 rounded-full border border-primary-100 shadow-sm transition-all group">
            <ArrowBack className="w-3.5 h-3.5 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
            {isRTL ? 'جميع المشاريع' : 'All Projects'}
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 container-wide pb-10 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.light}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {isRTL ? status.ar : status.en}
            </div>
            <div className="bg-white text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-100 shadow-sm">{project.sector[locale]}</div>
          </div>
          <h1 className="text-primary-900 text-3xl md:text-5xl font-black leading-tight max-w-3xl drop-shadow-sm">{project.title[locale]}</h1>
        </div>
      </div>

      {/* chapter nav */}
      <div className="sticky top-10 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {[
            { num: '01', label: isRTL ? 'القصة' : 'Story',       href: '#chapter-1' },
            { num: '02', label: isRTL ? 'من نستهدف' : 'Audience', href: '#chapter-2' },
            { num: '03', label: isRTL ? 'النتائج' : 'Results',    href: '#chapter-3' },
            { num: '04', label: isRTL ? 'الموارد' : 'Resources',  href: '#chapter-4' },
          ].map(ch => (
            <a key={ch.num} href={ch.href} className="flex items-center gap-2 px-6 py-3.5 text-neutral-400 hover:text-primary-600 text-sm font-bold transition-colors border-e border-neutral-100 last:border-e-0 shrink-0 hover:bg-primary-50/50 group">
              <span className="text-xs font-black text-neutral-200 group-hover:text-primary-300 transition-colors">{ch.num}</span>
              {ch.label}
            </a>
          ))}
        </div>
      </div>

      <div className="relative" style={{background:'linear-gradient(135deg, #f8f9ff 0%, #ffffff 40%, #fff8f8 70%, #f9f9ff 100%)'}}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-32 -start-20 w-80 h-80 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute top-1/2 -end-20 w-96 h-96 rounded-full bg-secondary-100/20 blur-3xl" />
          <div className="absolute bottom-32 start-1/3 w-72 h-72 rounded-full bg-primary-50/40 blur-3xl" />
        </div>

        {/* ch 01 */}
        <section id="chapter-1" className="relative z-10">
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary-200">01</div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary-200 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-3 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 text-primary-500 text-xs font-black uppercase tracking-widest mb-4">
                  <div className="w-6 h-0.5 bg-secondary-500 rounded-full" />
                  {isRTL ? 'عن المشروع' : 'About the Project'}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-primary-900 leading-tight mb-5">{isRTL ? 'لماذا هذا المشروع؟' : 'Why this project?'}</h2>
                <p className="text-neutral-600 text-base leading-loose">{project.fullDescription[locale]}</p>
              </div>
            </div>
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
                <Quote className="w-7 h-7 text-secondary-300 mb-3" />
                <p className="text-primary-700 text-sm font-semibold leading-relaxed italic line-clamp-5">&ldquo;{project.shortDescription[locale]}&rdquo;</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center shrink-0 border border-secondary-100"><Heart className="w-4 h-4 text-secondary-500" /></div>
                <div><p className="text-xs text-neutral-400 mb-0.5">{isRTL ? 'الجهة المانحة' : 'Funded by'}</p><p className="text-primary-700 font-black text-sm">{project.donor[locale]}</p></div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 border border-primary-100"><Calendar className="w-4 h-4 text-primary-500" /></div>
                <div><p className="text-xs text-neutral-400 mb-0.5">{isRTL ? 'المدة' : 'Duration'}</p><p className="text-primary-700 font-black text-sm">{months} {isRTL ? 'شهر' : 'months'}</p><p className="text-xs text-neutral-400">{fmtDate(startDate)} — {fmtDate(endDate)}</p></div>
              </div>
            </div>
          </div>
          <div className="container-wide pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <MapPin className="w-5 h-5 text-secondary-500" />, value: project.governorates.length, label: isRTL ? 'محافظة' : 'Governorates', bg: 'bg-secondary-50 border-secondary-100' },
              { icon: <Calendar className="w-5 h-5 text-primary-500" />, value: months, label: isRTL ? 'شهر' : 'Months', bg: 'bg-primary-50 border-primary-100' },
              { icon: <CheckCircle2 className="w-5 h-5 text-secondary-500" />, value: project.keyResults.length, label: isRTL ? 'نتيجة' : 'Results', bg: 'bg-secondary-50 border-secondary-100' },
              { icon: <Building2 className="w-5 h-5 text-primary-500" />, value: '1', label: isRTL ? 'جهة مانحة' : 'Donor', bg: 'bg-primary-50 border-primary-100' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border rounded-2xl p-5 flex items-center gap-4 bg-white shadow-sm`}>
                {s.icon}
                <div>
                  <div className="text-2xl font-black text-primary-800 leading-none">{s.value}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ch 02 */}
        <section id="chapter-2" className="relative z-10">
          <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-secondary-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-secondary-200">02</div>
              <div className="w-px flex-1 bg-gradient-to-b from-secondary-200 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-secondary-500 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-primary-500 rounded-full" />
                {isRTL ? 'الفئة المستهدفة' : 'Target Audience'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-primary-900 mb-4">{isRTL ? 'من نستهدف؟' : 'Who do we reach?'}</h2>
              <p className="text-neutral-500 text-base mb-10 max-w-2xl leading-relaxed">{project.targetGroup[locale]}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: <Users className="w-5 h-5 text-primary-500" />, bg: 'bg-primary-50 border-primary-100', label: isRTL ? 'النوع الاجتماعي' : 'Gender', content: <p className="text-primary-800 text-xl font-black">{genderLabel}</p> },
                  { icon: <Globe className="w-5 h-5 text-secondary-500" />, bg: 'bg-secondary-50 border-secondary-100', label: isRTL ? 'الفئات العمرية' : 'Age Groups', content: <div className="flex flex-wrap gap-2">{project.ageGroups.map(ag => <span key={ag} className="bg-secondary-50 text-secondary-600 text-xs font-bold px-3 py-1.5 rounded-full border border-secondary-100">{ag === 'all' ? (isRTL ? 'جميع الأعمار' : 'All Ages') : ag}</span>)}</div> },
                  { icon: <MapPin className="w-5 h-5 text-primary-500" />, bg: 'bg-primary-50 border-primary-100', label: isRTL ? 'مواقع التنفيذ' : 'Locations', content: <div className="flex flex-wrap gap-1.5">{project.governorates.map(g => <span key={g} className="bg-primary-50 text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-100">{g}</span>)}</div> },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4 border`}>{card.icon}</div>
                    <p className="text-xs text-neutral-400 font-bold uppercase mb-3">{card.label}</p>
                    {card.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ch 03 */}
        <section id="chapter-3" className="relative z-10">
          <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-secondary-100 to-transparent" />
          <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
            <div className="hidden md:flex flex-col items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary-200">03</div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary-200 to-transparent min-h-20" />
            </div>
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 text-primary-500 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-secondary-500 rounded-full" />
                {isRTL ? 'الأثر والنتائج' : 'Impact & Results'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-primary-900 mb-2">{isRTL ? 'ماذا حققنا؟' : 'What did we achieve?'}</h2>
              <p className="text-neutral-400 mb-10">{project.keyResults.length} {isRTL ? 'نتيجة رئيسية' : 'key results'}</p>
              <div className="space-y-4 mb-12">
                {project.keyResults.map((result, i) => (
                  <div key={i} className={`group bg-white rounded-2xl p-5 border ${chapterBorders[i % 4]} shadow-sm hover:shadow-md transition-all flex items-start gap-4`}>
                    <div className={`shrink-0 w-9 h-9 rounded-xl ${chapterAccents[i % 4]} text-white flex items-center justify-center font-black text-xs`}>{String(i + 1).padStart(2, '0')}</div>
                    <p className="text-neutral-700 leading-relaxed text-sm pt-1">{result[locale]}</p>
                    <CheckCircle2 className="w-4 h-4 text-neutral-200 group-hover:text-secondary-400 transition-colors shrink-0 mt-1.5" />
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                <p className="text-xs text-neutral-400 font-bold uppercase mb-4">{isRTL ? 'الجدول الزمني' : 'Timeline'}</p>
                <div className="flex items-center gap-4">
                  <div><p className="text-xs text-neutral-400">{isRTL ? 'بداية' : 'Start'}</p><p className="text-primary-700 font-bold text-sm">{fmtDate(startDate)}</p></div>
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-500" style={{width: project.status === 'completed' ? '100%' : project.status === 'active' ? '60%' : '5%'}} />
                  </div>
                  <div className="text-end"><p className="text-xs text-neutral-400">{isRTL ? 'نهاية' : 'End'}</p><p className="text-primary-700 font-bold text-sm">{fmtDate(endDate)}</p></div>
                </div>
                <p className="text-center text-neutral-400 text-xs mt-3">{months} {isRTL ? 'شهر' : 'months'} · {project.donor[locale]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* gallery */}
        {project.images.length > 0 && (
          <section className="relative z-10">
            <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
            <div className="container-wide py-16">
              <div className="inline-flex items-center gap-2 text-secondary-500 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-6 h-0.5 bg-primary-500 rounded-full" />
                {isRTL ? 'لقطات من الميدان' : 'From the Field'}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.images.map((img, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden bg-primary-50 border border-neutral-100 ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} group shadow-sm`}>
                    <Image src={img} alt={`${project.title[locale]} ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:768px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ch 04 */}
        {(relatedNews.length > 0 || relatedPubs.length > 0) && (
          <section id="chapter-4" className="relative z-10">
            <div className="h-px mx-auto max-w-5xl bg-gradient-to-r from-transparent via-secondary-100 to-transparent" />
            <div className="container-wide py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start">
              <div className="hidden md:flex flex-col items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-2xl bg-secondary-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-secondary-200">04</div>
              </div>
              <div className="md:col-span-4">
                <div className="inline-flex items-center gap-2 text-secondary-500 text-xs font-black uppercase tracking-widest mb-4">
                  <div className="w-6 h-0.5 bg-primary-500 rounded-full" />
                  {isRTL ? 'الموارد والمواد' : 'Resources & Materials'}
                </div>
                <h2 className="text-2xl font-black text-primary-900 mb-10">{isRTL ? 'اقرأ أكثر' : 'Read More'}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedNews.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase mb-4"><Newspaper className="w-3.5 h-3.5" />{isRTL ? 'أخبار ذات صلة' : 'Related News'}</p>
                      {relatedNews.map(n => (
                        <Link key={n.id} href={`/${locale}/media-center/${n.slug}`} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all group mb-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-primary-50"><Image src={n.image} alt={n.title[locale]} fill className="object-cover" sizes="56px" /></div>
                          <div><p className="text-xs text-neutral-400 mb-1">{new Date(n.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', {year:'numeric',month:'short'})}</p><p className="text-primary-700 text-sm font-bold group-hover:text-secondary-500 transition-colors line-clamp-2">{n.title[locale]}</p></div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {relatedPubs.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase mb-4"><BookOpen className="w-3.5 h-3.5" />{isRTL ? 'إصدارات ذات صلة' : 'Publications'}</p>
                      {relatedPubs.map(p => (
                        <Link key={p.id} href={`/${locale}/publications-reports/${p.slug}`} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:border-secondary-200 hover:shadow-md transition-all group mb-3">
                          <div className="w-11 h-11 bg-secondary-50 rounded-xl flex items-center justify-center shrink-0 border border-secondary-100"><BookOpen className="w-4 h-4 text-secondary-500" /></div>
                          <div><p className="text-primary-700 text-sm font-bold group-hover:text-secondary-500 transition-colors line-clamp-2">{p.title[locale]}</p><p className="text-xs text-neutral-400 mt-1">{new Date(p.publishDate).getFullYear()}</p></div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative z-10">
          <div className="container-wide pb-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-10 md:p-14 text-center shadow-2xl shadow-primary-200">
              <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'20px 20px'}} />
              <Sparkles className="w-9 h-9 text-white/40 mx-auto mb-5" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{isRTL ? 'هل تريد المشاركة أو الاستفسار؟' : 'Want to get involved?'}</h2>
              <p className="text-white/75 max-w-lg mx-auto mb-8 text-sm leading-relaxed">{isRTL ? 'تواصل معنا وسنكون سعداء بالرد على استفساراتك حول هذا المشروع.' : "Reach out and we'll be happy to tell you more."}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 bg-white text-primary-600 font-black px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm shadow-sm"><ExternalLink className="w-4 h-4" />{isRTL ? 'تواصل معنا' : 'Contact Us'}</Link>
                <Link href={`/${locale}/programs-projects`} className="inline-flex items-center gap-2 bg-white/15 text-white font-bold px-7 py-3 rounded-xl border border-white/25 hover:bg-white/25 transition-colors text-sm"><ArrowBack className="w-4 h-4" />{isRTL ? 'مشاريع أخرى' : 'More Projects'}</Link>
              </div>
            </div>
          </div>
        </section>
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
        <Image src={project.featuredImage} alt={project.title[locale]} fill className="object-cover opacity-40" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end container-wide pb-10">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border w-fit mb-4 ${status.light}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {isRTL ? status.ar : status.en}
          </div>
          <div className="inline-flex items-center gap-2 bg-secondary-500/20 text-secondary-300 text-xs font-bold px-3 py-1.5 rounded-full border border-secondary-500/30 w-fit mb-3">
            {project.sector[locale]}
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl">{project.title[locale]}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute top-1/3 -end-24 w-80 h-80 rounded-full bg-secondary-100/30 blur-3xl" />
          <div className="absolute bottom-0 start-1/3 w-72 h-72 rounded-full bg-primary-100/20 blur-3xl" />
        </div>
        <div className="relative container-wide py-10 lg:py-14">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left — main content */}
            <div className="lg:col-span-2 space-y-10">
              <Link href={`/${locale}/programs-projects`} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors group">
                <ArrowBack className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                {isRTL ? 'العودة إلى المشاريع' : 'Back to Projects'}
              </Link>

              <div>
                <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                  <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                  {isRTL ? 'نبذة عن المشروع' : 'About the Project'}
                </h2>
                <p className="text-neutral-700 leading-relaxed text-base mb-4">{project.shortDescription[locale]}</p>
                <p className="text-neutral-600 leading-relaxed text-sm">{project.fullDescription[locale]}</p>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                  <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                  {isRTL ? 'الفئة المستهدفة' : 'Target Group'}
                </h2>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-neutral-700 text-sm leading-relaxed mb-4">{project.targetGroup[locale]}</p>
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
                      project.genderClassification === 'mixed'  ? 'bg-purple-100 text-purple-700' :
                      project.genderClassification === 'female' ? 'bg-pink-100 text-pink-700' :
                      project.genderClassification === 'male'   ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'}`}>
                      <Users className="w-3 h-3" />
                      {project.genderClassification === 'mixed'  ? (isRTL ? 'ذكور وإناث' : 'Mixed') :
                       project.genderClassification === 'female' ? (isRTL ? 'إناث' : 'Female') :
                       project.genderClassification === 'male'   ? (isRTL ? 'ذكور' : 'Male') :
                       (isRTL ? 'شباب' : 'Youth')}
                    </div>
                    {project.ageGroups.map(ag => (
                      <span key={ag} className="text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full">
                        {ag === 'all' ? (isRTL ? 'جميع الأعمار' : 'All Ages') : ag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                  <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                  {isRTL ? 'النتائج الرئيسية' : 'Key Results'}
                </h2>
                <div className="space-y-3">
                  {project.keyResults.map((result, i) => (
                    <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-700 leading-relaxed">{result[locale]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {project.images.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                    <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                    {isRTL ? 'معرض الصور' : 'Photo Gallery'}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {project.images.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-neutral-100">
                        <Image src={img} alt={`${project.title[locale]} ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 33vw" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedNews.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                    <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                    {isRTL ? 'أخبار ذات صلة' : 'Related News'}
                  </h2>
                  <div className="space-y-3">
                    {relatedNews.map(n => (
                      <Link key={n.id} href={`/${locale}/media-center/${n.slug}`} className="flex items-start gap-4 p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all group">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-primary-50">
                          <Image src={n.image} alt={n.title[locale]} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Newspaper className="w-3 h-3 text-secondary-500 shrink-0" />
                            <span className="text-xs text-neutral-400">{new Date(n.date).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', {year:'numeric',month:'short',day:'numeric'})}</span>
                          </div>
                          <p className="text-sm font-bold text-primary-500 group-hover:text-secondary-500 transition-colors line-clamp-2">{n.title[locale]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {relatedPubs.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-primary-500 font-black text-lg mb-4">
                    <span className="w-1 h-6 bg-secondary-500 rounded-full" />
                    {isRTL ? 'إصدارات ذات صلة' : 'Related Publications'}
                  </h2>
                  <div className="space-y-3">
                    {relatedPubs.map(p => (
                      <Link key={p.id} href={`/${locale}/publications-reports/${p.slug}`} className="flex items-start gap-4 p-4 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary-500 group-hover:text-secondary-500 transition-colors line-clamp-2">{p.title[locale]}</p>
                          <p className="text-xs text-neutral-400 mt-1">{new Date(p.publishDate).getFullYear()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm sticky top-12">
                <h3 className="font-black text-primary-500 text-base mb-5 pb-4 border-b border-neutral-100">
                  {isRTL ? 'معلومات المشروع' : 'Project Info'}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: <Building2 className="w-4 h-4 text-primary-500" />, label: isRTL ? 'الجهة المانحة' : 'Donor', value: project.donor[locale] },
                    { icon: <Calendar className="w-4 h-4 text-primary-500" />, label: isRTL ? 'فترة التنفيذ' : 'Period', value: `${fmtDate(startDate)} – ${fmtDate(endDate)}`, sub: `${months} ${isRTL ? 'شهر' : 'months'}` },
                    { icon: <MapPin className="w-4 h-4 text-primary-500" />, label: isRTL ? 'القطاع' : 'Sector', value: project.sector[locale] },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">{row.icon}</div>
                      <div>
                        <p className="text-xs text-neutral-400 font-medium mb-0.5">{row.label}</p>
                        <p className="text-sm font-bold text-primary-500">{row.value}</p>
                        {row.sub && <p className="text-xs text-neutral-400 mt-0.5">{row.sub}</p>}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><MapPin className="w-4 h-4 text-primary-500" /></div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium mb-1">{isRTL ? 'مواقع التنفيذ' : 'Locations'}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.governorates.map(g => <span key={g} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">{g}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4 text-primary-500" /></div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium mb-0.5">{isRTL ? 'الحالة' : 'Status'}</p>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${status.light}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {isRTL ? status.ar : status.en}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <Link href={`/${locale}/contact`} className="w-full flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-5 rounded-xl transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" />
                    {isRTL ? 'تواصل معنا حول هذا المشروع' : 'Contact Us About This Project'}
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
