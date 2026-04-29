'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Initiative, Locale } from '@/types'
import {
  Search, X, Calendar, ArrowRight, ArrowLeft,
  LayoutGrid, List, Zap, CheckCircle2, Megaphone, Star,
} from 'lucide-react'

interface Props { initiatives: Initiative[]; locale: Locale }

const CATEGORY = {
  'initiative':        { ar: 'مبادرة',        en: 'Initiative',        badge: 'bg-purple-50 text-purple-700 border-purple-200',  dot: 'bg-purple-500',  color: '#8b5cf6' },
  'digital-campaign':  { ar: 'حملة رقمية',    en: 'Digital Campaign',  badge: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500',    color: '#3b82f6' },
  'advocacy-campaign': { ar: 'حملة مناصرة',   en: 'Advocacy Campaign', badge: 'bg-orange-50 text-orange-700 border-orange-200',   dot: 'bg-orange-500',  color: '#f59e0b' },
  'awareness-campaign':{ ar: 'حملة توعية',    en: 'Awareness Campaign',badge: 'bg-green-50 text-green-700 border-green-200',      dot: 'bg-green-500',   color: '#10b981' },
}

function isOngoing(init: Initiative) { return !init.endDate || new Date(init.endDate) >= new Date() }

export default function InitiativesGrid({ initiatives, locale }: Props) {
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const [search, setSearch]     = useState('')
  const [catTab, setCatTab]     = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => initiatives.filter(i => {
    if (search && !i.title[locale].toLowerCase().includes(search.toLowerCase()) && !i.shortDescription[locale].toLowerCase().includes(search.toLowerCase())) return false
    if (catTab !== 'all' && i.category !== catTab) return false
    return true
  }), [initiatives, search, catTab, locale])

  const featured = viewMode === 'grid' && catTab === 'all' && !search
    ? filtered[0] : null
  const rest = featured ? filtered.slice(1) : filtered

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'short' })

  return (
    <div>
      {/* ── Category tabs ── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {([
          { key: 'all',              label: isRTL ? 'الكل' : 'All',               Icon: Star,          count: initiatives.length },
          { key: 'initiative',       label: isRTL ? 'مبادرات' : 'Initiatives',    Icon: Zap,           count: initiatives.filter(i=>i.category==='initiative').length },
          { key: 'digital-campaign', label: isRTL ? 'حملات رقمية' : 'Digital',   Icon: Megaphone,     count: initiatives.filter(i=>i.category==='digital-campaign').length },
          { key: 'advocacy-campaign',label: isRTL ? 'مناصرة' : 'Advocacy',       Icon: CheckCircle2,  count: initiatives.filter(i=>i.category==='advocacy-campaign').length },
          { key: 'awareness-campaign',label:isRTL ? 'توعية' : 'Awareness',       Icon: Megaphone,     count: initiatives.filter(i=>i.category==='awareness-campaign').length },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setCatTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
              catTab === tab.key
                ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary-300 hover:text-primary-500'
            }`}
          >
            <tab.Icon className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${catTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{tab.count}</span>
          </button>
        ))}
        <div className="ms-auto flex items-center gap-2">
          <div className="hidden md:flex items-center border border-neutral-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode==='grid' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode==='list' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isRTL ? 'ابحث عن مبادرة أو حملة...' : 'Search initiatives & campaigns...'}
            className="w-full ps-10 pe-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
          />
          {search && <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      <p className="text-sm text-neutral-400 mb-5 font-medium">
        {isRTL ? `${filtered.length} من ${initiatives.length} نشاط` : `${filtered.length} of ${initiatives.length} activities`}
      </p>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100">
          <Search className="w-12 h-12 mx-auto mb-4 text-neutral-200" />
          <p className="font-black text-primary-500 text-lg mb-1">{isRTL ? 'لا توجد نتائج' : 'No results found'}</p>
          <p className="text-sm text-neutral-400">{isRTL ? 'جرّب تغيير معايير البحث' : 'Try adjusting your search or filters'}</p>
        </div>
      )}

      {/* ── Featured card ── */}
      {featured && (
        <Link
          href={`/${locale}/initiatives-campaigns/${featured.slug}`}
          className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-primary-900 mb-6 min-h-[280px] hover:shadow-2xl hover:shadow-primary-900/20 transition-all duration-500"
        >
          <div className="relative md:w-1/2 h-52 md:h-auto overflow-hidden">
            <Image src={featured.featuredImage} alt={featured.title[locale]} fill className="object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" sizes="50vw" />
            <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-primary-900/70 via-transparent to-transparent`} />
          </div>
          <div className="relative md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-primary-800 to-primary-900">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-secondary-500/20 text-secondary-300 border border-secondary-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                  {isRTL ? 'مميز' : 'Featured'}
                </span>
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  {CATEGORY[featured.category][isRTL ? 'ar' : 'en']}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors">
                {featured.title[locale]}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-6">{featured.shortDescription[locale]}</p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: isRTL ? 'مخرج' : 'Outputs', value: featured.outputs.length },
                  { label: isRTL ? 'صور' : 'Images', value: featured.images.length },
                  { label: isRTL ? 'حالة' : 'Status', value: isOngoing(featured) ? (isRTL ? 'جارٍ' : 'Live') : (isRTL ? 'منتهي' : 'Done') },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar className="w-3.5 h-3.5" />
                {fmtDate(featured.startDate)}
                {featured.endDate && <> — {fmtDate(featured.endDate)}</>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondary-400 font-black text-sm group-hover:gap-3 transition-all mt-5">
              {isRTL ? 'استعرض التفاصيل' : 'View Details'} <Arrow className="w-4 h-4" />
            </div>
          </div>
        </Link>
      )}

      {/* ── Grid view ── */}
      {viewMode === 'grid' && rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(init => {
            const cat = CATEGORY[init.category]
            const ongoing = isOngoing(init)
            return (
              <Link
                key={init.id}
                href={`/${locale}/initiatives-campaigns/${init.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-primary-50">
                  <Image src={init.featuredImage} alt={init.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className={`absolute top-3 start-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cat.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} ${ongoing ? 'animate-pulse' : ''}`} />
                    {cat[isRTL ? 'ar' : 'en']}
                  </div>
                </div>
                <div className="h-0.5 w-full" style={{ background: cat.color }} />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-primary-500 text-base leading-snug mb-2 group-hover:text-secondary-500 transition-colors line-clamp-2">
                    {init.title[locale]}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-4">{init.shortDescription[locale]}</p>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {fmtDate(init.startDate)}
                    {init.endDate && <> — {fmtDate(init.endDate)}</>}
                  </div>
                  <div className="mt-auto border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      <span className="font-black text-primary-500">{init.outputs.length}</span> {isRTL ? 'مخرجات' : 'outputs'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-secondary-500 group-hover:gap-2 transition-all">
                      {isRTL ? 'تفاصيل' : 'Details'} <Arrow className="w-3 h-3" />
                    </span>
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
          {rest.map(init => {
            const cat = CATEGORY[init.category]
            const ongoing = isOngoing(init)
            return (
              <Link
                key={init.id}
                href={`/${locale}/initiatives-campaigns/${init.slug}`}
                className="group flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={init.featuredImage} alt={init.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" />
                </div>
                <div className="w-1 h-14 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cat.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} ${ongoing ? 'animate-pulse' : ''}`} />
                      {cat[isRTL ? 'ar' : 'en']}
                    </span>
                  </div>
                  <h3 className="font-black text-primary-500 text-sm leading-snug group-hover:text-secondary-500 transition-colors line-clamp-1 mb-1">{init.title[locale]}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {fmtDate(init.startDate)}{init.endDate && ` — ${fmtDate(init.endDate)}`}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-primary-500">{init.outputs.length} {isRTL ? 'مخرجات' : 'outputs'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.badge}`}>{ongoing ? (isRTL ? 'جارٍ' : 'Ongoing') : (isRTL ? 'منتهي' : 'Ended')}</span>
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
