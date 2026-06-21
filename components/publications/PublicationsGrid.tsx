'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Publication, Locale } from '@/types'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import {
  Search, X, Calendar, Download, FileText,
  ArrowRight, ArrowLeft, LayoutGrid, List,
  BookOpen, Microscope, FileBarChart2, BookMarked, Newspaper,
  Tag, ChevronDown,
} from 'lucide-react'

interface Props {
  publications: Publication[]
  locale: Locale
  typeLabels?: Record<string, string>
}

const TYPE = {
  'report':       { ar: 'تقارير',        en: 'Reports',       icon: FileBarChart2, badge: 'bg-blue-50 text-blue-700 border-blue-200',     dark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   color: '#3b82f6' },
  'study':        { ar: 'دراسات',        en: 'Studies',       icon: Microscope,    badge: 'bg-purple-50 text-purple-700 border-purple-200', dark: 'bg-purple-500/20 text-purple-300 border-purple-500/30', color: '#8b5cf6' },
  'policy-paper': { ar: 'أوراق سياسات', en: 'Policy Papers', icon: FileText,      badge: 'bg-amber-50 text-amber-700 border-amber-200',    dark: 'bg-amber-500/20 text-amber-300 border-amber-500/30',  color: '#f59e0b' },
  'guide':        { ar: 'أدلة',          en: 'Guides',        icon: BookOpen,      badge: 'bg-green-50 text-green-700 border-green-200',    dark: 'bg-green-500/20 text-green-300 border-green-500/30',  color: '#10b981' },
  'brief':        { ar: 'موجزات',        en: 'Briefs',        icon: Newspaper,     badge: 'bg-rose-50 text-rose-700 border-rose-200',       dark: 'bg-rose-500/20 text-rose-300 border-rose-500/30',     color: '#f43f5e' },
} as const

const TYPE_SINGULAR: Record<string, Record<string, string>> = {
  'report':       { ar: 'تقرير',        en: 'Report' },
  'study':        { ar: 'دراسة',        en: 'Study' },
  'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper' },
  'guide':        { ar: 'دليل',         en: 'Guide' },
  'brief':        { ar: 'موجز',         en: 'Brief' },
}

type PubType = keyof typeof TYPE

function singularTypeLabel(type: string, locale: Locale, typeLabels?: Record<string, string>): string {
  if (typeLabels?.[type]) return typeLabels[type]
  return TYPE_SINGULAR[type]?.[locale] ?? type
}

export default function PublicationsGrid({ publications, locale, typeLabels }: Props) {
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const [search, setSearch]           = useState('')
  const [typeTab, setTypeTab]         = useState('all')
  const [yearFilter, setYearFilter]   = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid')
  const [topicOpen, setTopicOpen]     = useState(false)

  const years  = useMemo(() => Array.from(new Set(publications.map(p => p.publishDate.slice(0, 4)))).sort((a, b) => Number(b) - Number(a)), [publications])
  const topics = useMemo(() => Array.from(new Set(publications.flatMap(p => p.tags.map(t => t[locale])))).sort(), [publications, locale])

  const filtered = useMemo(() => publications.filter(p => {
    if (search && !p.title[locale].toLowerCase().includes(search.toLowerCase()) && !p.summary[locale].toLowerCase().includes(search.toLowerCase())) return false
    if (typeTab !== 'all' && p.type !== typeTab) return false
    if (yearFilter !== 'all' && !p.publishDate.startsWith(yearFilter)) return false
    if (topicFilter !== 'all' && !p.tags.some(t => t[locale] === topicFilter)) return false
    return true
  }), [publications, search, typeTab, yearFilter, topicFilter, locale])

  const featured = viewMode === 'grid' && typeTab === 'all' && !search && yearFilter === 'all' && topicFilter === 'all'
    ? filtered[0] : null
  const rest = featured ? filtered.slice(1) : filtered

  const tabs = [
    { key: 'all', label: isRTL ? 'الكل' : 'All', Icon: BookMarked, count: publications.length },
    ...Object.entries(TYPE).map(([key, val]) => ({
      key,
      label: isRTL ? val.ar : val.en,
      Icon: val.icon,
      count: publications.filter(p => p.type === key).length,
    })).filter(t => t.count > 0),
  ]

  const activeFilters = [
    ...(yearFilter !== 'all' ? [{ label: yearFilter, clear: () => setYearFilter('all') }] : []),
    ...(topicFilter !== 'all' ? [{ label: topicFilter, clear: () => setTopicFilter('all') }] : []),
  ]

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })

  return (
    <div>

      {/* ── Row 1: Type tabs + dropdowns + view toggle ── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTypeTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                typeTab === tab.key
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary-300 hover:text-primary-500'
              }`}
            >
              <tab.Icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${typeTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-2 shrink-0">
          {/* Year */}
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="text-sm border border-neutral-200 rounded-xl px-3 py-2 bg-white text-primary-500 focus:outline-none focus:border-primary-400 appearance-none cursor-pointer"
          >
            <option value="all">{isRTL ? 'كل السنوات' : 'All Years'}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Topic */}
          <div className="relative">
            <button
              onClick={() => setTopicOpen(o => !o)}
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all ${topicFilter !== 'all' ? 'bg-secondary-50 border-secondary-300 text-secondary-600 font-bold' : 'bg-white border-neutral-200 text-neutral-500 hover:border-primary-300'}`}
            >
              <Tag className="w-3.5 h-3.5" />
              {topicFilter !== 'all' ? topicFilter : (isRTL ? 'الموضوع' : 'Topic')}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
            </button>
            {topicOpen && (
              <div className="absolute top-full start-0 mt-1 z-50 bg-white border border-neutral-100 rounded-2xl shadow-xl py-2 min-w-48 max-h-64 overflow-y-auto">
                <button onClick={() => { setTopicFilter('all'); setTopicOpen(false) }} className={`w-full text-start px-4 py-2 text-sm font-bold transition-colors ${topicFilter === 'all' ? 'text-primary-500 bg-primary-50' : 'text-neutral-500 hover:bg-neutral-50'}`}>
                  {isRTL ? 'كل المواضيع' : 'All Topics'}
                </button>
                {topics.map(topic => (
                  <button key={topic} onClick={() => { setTopicFilter(topic); setTopicOpen(false) }} className={`w-full text-start px-4 py-2 text-sm transition-colors ${topicFilter === topic ? 'text-secondary-600 bg-secondary-50 font-bold' : 'text-neutral-500 hover:bg-neutral-50'}`}>
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode */}
          <div className="hidden md:flex items-center border border-neutral-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Search ── */}
      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={isRTL ? 'ابحث في المنشورات...' : 'Search publications...'}
          className="w-full ps-10 pe-10 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
        />
        {search && <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>}
      </div>

      {/* ── Active filter pills ── */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {activeFilters.map((f, i) => (
            <button key={i} onClick={f.clear} className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-600 border border-secondary-200 hover:bg-secondary-100 transition-colors">
              {f.label} <X className="w-3 h-3" />
            </button>
          ))}
          <button onClick={() => { setYearFilter('all'); setTopicFilter('all') }} className="text-xs text-neutral-400 hover:text-neutral-600 underline transition-colors">
            {isRTL ? 'مسح الكل' : 'Clear all'}
          </button>
        </div>
      )}

      {/* ── Results count ── */}
      <p className="text-sm text-neutral-400 mb-5 font-medium">
        {isRTL ? `${filtered.length} من ${publications.length} منشور` : `${filtered.length} of ${publications.length} publications`}
      </p>

      {/* ── Empty ── */}
      {filtered.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100">
          <Search className="w-12 h-12 mx-auto mb-4 text-neutral-200" />
          <p className="font-black text-primary-500 text-lg mb-1">{isRTL ? 'لا توجد نتائج' : 'No results found'}</p>
          <p className="text-sm text-neutral-400">{isRTL ? 'جرّب تغيير معايير البحث' : 'Try adjusting your search or filters'}</p>
        </div>
      )}

      {/* ── Featured: horizontal book card ── */}
      {featured && (() => {
        const t = TYPE[featured.type as PubType]
        const TypeIcon = t.icon
        return (
          <Link
            href={`/${locale}/publications-reports/${featured.slug}`}
            className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-primary-900 mb-6 hover:shadow-2xl hover:shadow-primary-900/20 transition-all duration-500"
          >
            <div className="relative md:w-56 shrink-0 h-64 md:h-auto overflow-hidden" style={{ background: t.color }}>
              <Image src={featured.coverImage} alt={featured.title[locale]} fill className="object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" sizes="224px" unoptimized={isCmsHostedMediaUrl(featured.coverImage)} />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="bg-black/40 rounded-xl p-3 text-center backdrop-blur-sm">
                  <TypeIcon className="w-6 h-6 text-white mx-auto mb-1" />
                  <div className="text-white/80 text-xs font-bold">{singularTypeLabel(featured.type, locale, typeLabels)}</div>
                  {featured.pages && <div className="text-white/50 text-xs mt-1">{featured.pages} {isRTL ? 'صفحة' : 'pages'}</div>}
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-primary-800 to-primary-900">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-secondary-500/20 text-secondary-300 border border-secondary-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                    {isRTL ? 'أحدث إصدار' : 'Latest'}
                  </span>
                  <span className="text-xs text-white/40 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    <TypeIcon className="w-3 h-3" />
                    {singularTypeLabel(featured.type, locale, typeLabels)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors">
                  {featured.title[locale]}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5">{featured.summary[locale]}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-white/50 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">{tag[locale]}</span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isRTL ? 'صفحة' : 'Pages', value: featured.pages ?? '—' },
                    { label: isRTL ? 'مؤلف' : 'Authors', value: featured.authors?.length ?? '—' },
                    { label: isRTL ? 'سنة' : 'Year', value: featured.publishDate.slice(0, 4) },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-xl font-black text-white">{s.value}</div>
                      <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2 text-secondary-400 font-black text-sm group-hover:gap-3 transition-all">
                  {isRTL ? 'قراءة التفاصيل' : 'Read More'} <Arrow className="w-4 h-4" />
                </div>
                {featured.pdfUrl && (
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(featured.pdfUrl, '_blank') }}
                    className="flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full bg-white/10 text-white/60 hover:bg-secondary-500 hover:text-white border border-white/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                )}
              </div>
            </div>
          </Link>
        )
      })()}

      {/* ── Grid view ── */}
      {viewMode === 'grid' && rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {rest.map(pub => {
            const t = TYPE[pub.type as PubType]
            const TypeIcon = t.icon
            return (
              <Link
                key={pub.id}
                href={`/${locale}/publications-reports/${pub.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden" style={{ backgroundColor: t.color + '15' }}>
                  <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" unoptimized={isCmsHostedMediaUrl(pub.coverImage)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className={`absolute top-3 start-3 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${t.badge}`}>
                    <TypeIcon className="w-3 h-3" />
                    {singularTypeLabel(pub.type, locale, typeLabels)}
                  </div>
                </div>
                <div className="h-0.5 w-full" style={{ backgroundColor: t.color }} />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-black text-primary-500 text-sm leading-snug mb-2 group-hover:text-secondary-500 transition-colors line-clamp-2">
                    {pub.title[locale]}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pub.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">{tag[locale]}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {pub.publishDate.slice(0, 4)}
                      {pub.pages && <><span className="mx-1 text-neutral-200">·</span>{pub.pages}{isRTL ? 'ص' : 'p'}</>}
                    </span>
                    {pub.pdfUrl && (
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(pub.pdfUrl, '_blank') }} className="flex items-center gap-1 font-bold text-secondary-500 hover:text-secondary-600">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === 'list' && rest.length > 0 && (
        <div className="flex flex-col gap-3">
          {rest.map(pub => {
            const t = TYPE[pub.type as PubType]
            const TypeIcon = t.icon
            return (
              <Link
                key={pub.id}
                href={`/${locale}/publications-reports/${pub.slug}`}
                className="group flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={pub.coverImage} alt={pub.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="64px" unoptimized={isCmsHostedMediaUrl(pub.coverImage)} />
                  <div className="absolute top-0 start-0 bottom-0 w-1.5 rounded-s-xl" style={{ backgroundColor: t.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${t.badge}`}>
                      <TypeIcon className="w-3 h-3" />{singularTypeLabel(pub.type, locale, typeLabels)}
                    </span>
                    <span className="text-xs text-neutral-400">{pub.publishDate.slice(0, 4)}</span>
                  </div>
                  <h3 className="font-black text-primary-500 text-sm leading-snug group-hover:text-secondary-500 transition-colors line-clamp-1 mb-1">{pub.title[locale]}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-1">{pub.summary[locale]}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pub.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">{tag[locale]}</span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                  {pub.pages && <span className="text-xs text-neutral-400 flex items-center gap-1"><FileText className="w-3 h-3" />{pub.pages} {isRTL ? 'ص' : 'p'}</span>}
                  {pub.pdfUrl && (
                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(pub.pdfUrl, '_blank') }} className="flex items-center gap-1 text-xs font-bold text-secondary-500 hover:text-secondary-600 px-2.5 py-1 rounded-full border border-secondary-200 bg-secondary-50 transition-colors">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  )}
                </div>
                <Arrow className="w-4 h-4 text-neutral-300 group-hover:text-secondary-500 transition-colors shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
