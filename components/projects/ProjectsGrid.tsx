'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project, Locale } from '@/types'
import { projectMatchesGovernorate, projectMatchesGenderFilter } from '@/lib/mapCmsProject'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import {
  Search, Filter, X, MapPin, Calendar, Users, Building2,
  ArrowRight, ArrowLeft, ChevronDown, LayoutGrid, List,
  Zap, CheckCircle2, Clock3, Sparkles,
} from 'lucide-react'

interface Props { projects: Project[]; locale: Locale }

const STATUS = {
  active:    { ar: 'نشط',    en: 'Active',    dot: 'bg-green-500',   badge: 'bg-green-50 text-green-700 border-green-200' },
  completed: { ar: 'مكتمل', en: 'Completed', dot: 'bg-neutral-400', badge: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  upcoming:  { ar: 'قادم',   en: 'Upcoming',  dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700 border-blue-200' },
}
const GENDER_COLORS: Record<string, string> = {
  mixed: 'text-purple-600 bg-purple-50 border-purple-100',
  female: 'text-pink-600 bg-pink-50 border-pink-100',
  male: 'text-blue-600 bg-blue-50 border-blue-100',
  youth: 'text-orange-600 bg-orange-50 border-orange-100',
}
const SECTOR_COLORS = ['#3b4cca','#e63946','#8b5cf6','#f59e0b','#10b981','#06b6d4']

function timelineProgress(start: string, end: string): number {
  const s = new Date(start).getTime(), e = new Date(end).getTime(), n = Date.now()
  if (n <= s) return 0
  if (n >= e) return 100
  return Math.round(((n - s) / (e - s)) * 100)
}

export default function ProjectsGrid({ projects, locale }: Props) {
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const [search, setSearch]             = useState('')
  const [statusTab, setStatusTab]       = useState('all')
  const [filterSector, setFilterSector] = useState('all')
  const [filterGov, setFilterGov]       = useState('all')
  const [filterDonor, setFilterDonor]   = useState('all')
  const [filterGender, setFilterGender] = useState('all')
  const [showFilters, setShowFilters]   = useState(false)
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid')

  const sectors = useMemo(() => {
    const keys = Array.from(new Set(projects.map(p => p.sectorKey)))
    return keys.map(key => ({
      key,
      label: projects.find(p => p.sectorKey === key)?.sector[locale] ?? key,
    }))
  }, [projects, locale])
  const govs = useMemo(() => {
    const map = new Map<string, string>()
    projects.forEach((p) => {
      if (p.governorateKeys?.length) {
        p.governorateKeys.forEach((key, index) => {
          map.set(key, p.governorates[index] ?? key)
        })
      } else {
        p.governorates.forEach((label) => map.set(label, label))
      }
    })
    return Array.from(map.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, locale))
  }, [projects, locale])
  const donors  = useMemo(() => Array.from(new Set(projects.map(p => p.donor[locale]))).sort(), [projects, locale])

  const sectorColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    sectors.forEach((s, i) => { map[s.key] = SECTOR_COLORS[i % SECTOR_COLORS.length] })
    return map
  }, [sectors])

  const filtered = useMemo(() => projects.filter(p => {
    if (search && !p.title[locale].toLowerCase().includes(search.toLowerCase()) && !p.shortDescription[locale].toLowerCase().includes(search.toLowerCase())) return false
    if (statusTab !== 'all' && p.status !== statusTab) return false
    if (filterSector !== 'all' && p.sectorKey !== filterSector) return false
    if (filterGov !== 'all' && !projectMatchesGovernorate(p, filterGov)) return false
    if (filterDonor !== 'all' && p.donor[locale] !== filterDonor) return false
    if (filterGender !== 'all' && !projectMatchesGenderFilter(p, filterGender)) return false
    return true
  }), [projects, search, statusTab, filterSector, filterGov, filterDonor, filterGender, locale])

  const advancedActive = [filterSector, filterGov, filterDonor, filterGender].filter(f => f !== 'all').length
  const resetAdvanced = () => { setFilterSector('all'); setFilterGov('all'); setFilterDonor('all'); setFilterGender('all') }

  const featured = viewMode === 'grid' && statusTab === 'all' && !search && advancedActive === 0
    ? filtered.find(p => p.status === 'active') : null
  const rest = featured ? filtered.filter(p => p.id !== featured.id) : filtered

  const sel = 'w-full text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-primary-500 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 appearance-none'

  return (
    <div>
      {/* ── Status tabs ── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {([
          { key: 'all',       label: isRTL ? 'الكل'    : 'All',       Icon: Sparkles,     count: projects.length },
          { key: 'active',    label: isRTL ? 'نشط'    : 'Active',     Icon: Zap,          count: projects.filter(p=>p.status==='active').length },
          { key: 'completed', label: isRTL ? 'مكتمل' : 'Completed',  Icon: CheckCircle2, count: projects.filter(p=>p.status==='completed').length },
          { key: 'upcoming',  label: isRTL ? 'قادم'   : 'Upcoming',   Icon: Clock3,       count: projects.filter(p=>p.status==='upcoming').length },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
              statusTab === tab.key
                ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary-300 hover:text-primary-500'
            }`}
          >
            <tab.Icon className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${statusTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
        <div className="ms-auto flex items-center gap-2">
          <div className="hidden md:flex items-center border border-neutral-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode==='grid' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode==='list' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-400 hover:text-primary-500'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Search + filter button ── */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isRTL ? 'ابحث عن مشروع...' : 'Search projects...'}
            className="w-full ps-10 pe-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
          />
          {search && <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>}
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition-all ${showFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-primary-500 border-neutral-200 hover:border-primary-300'}`}
        >
          <Filter className="w-4 h-4" />
          {isRTL ? 'فلترة' : 'Filter'}
          {advancedActive > 0 && <span className="w-5 h-5 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-black">{advancedActive}</span>}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        {advancedActive > 0 && (
          <button onClick={resetAdvanced} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-secondary-500 transition-colors">
            <X className="w-4 h-4" />{isRTL ? 'مسح' : 'Clear'}
          </button>
        )}
      </div>

      {/* ── Advanced filters ── */}
      {showFilters && (
        <div className="mb-5 p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: isRTL ? 'القطاع' : 'Sector', value: filterSector, set: setFilterSector, opts: sectors.map(s => ({ value: s.key, label: s.label })) },
            { label: isRTL ? 'المحافظة' : 'Governorate', value: filterGov, set: setFilterGov, opts: govs.map((g) => ({ value: g.key, label: g.label })) },
            { label: isRTL ? 'الجهة المانحة' : 'Donor', value: filterDonor, set: setFilterDonor, opts: donors.map(d => ({ value: d, label: d })) },
            { label: isRTL ? 'الجنس' : 'Gender', value: filterGender, set: setFilterGender,
              opts: [
                { value: 'both', label: isRTL ? 'ذكور وإناث' : 'Male & Female' },
                { value: 'female', label: isRTL ? 'إناث' : 'Female' },
                { value: 'male', label: isRTL ? 'ذكور' : 'Male' },
              ] },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-black text-neutral-400 mb-2 uppercase tracking-wider">{f.label}</label>
              <div className="relative">
                <select value={f.value} onChange={e => f.set(e.target.value)} className={sel}>
                  <option value="all">{isRTL ? 'الكل' : 'All'}</option>
                  {f.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results count ── */}
      <p className="text-sm text-neutral-400 mb-5 font-medium">
        {isRTL ? `${filtered.length} من ${projects.length} مشروع` : `${filtered.length} of ${projects.length} projects`}
      </p>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100">
          <Search className="w-12 h-12 mx-auto mb-4 text-neutral-200" />
          <p className="font-black text-primary-500 text-lg mb-1">{isRTL ? 'لا توجد مشاريع' : 'No projects found'}</p>
          <p className="text-sm text-neutral-400">{isRTL ? 'جرّب تغيير معايير البحث' : 'Try adjusting your search or filters'}</p>
        </div>
      )}

      {/* ── Featured card ── */}
      {featured && (
        <Link
          href={`/${locale}/programs-projects/${featured.slug}`}
          className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-primary-900 mb-6 min-h-[280px] hover:shadow-2xl hover:shadow-primary-900/20 transition-all duration-500"
        >
          <div className="relative md:w-1/2 h-52 md:h-auto overflow-hidden">
            <Image src={featured.featuredImage} alt={featured.title[locale]} fill className="object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" sizes="50vw" unoptimized={isCmsHostedMediaUrl(featured.featuredImage)} />
            <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-primary-900/70 via-transparent to-transparent`} />
          </div>
          <div className="relative md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-primary-800 to-primary-900">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {isRTL ? 'مشروع مميز · نشط' : 'Featured · Active'}
                </span>
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">{featured.sector[locale]}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors">
                {featured.title[locale]}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-6">{featured.shortDescription[locale]}</p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: isRTL ? 'نتائج' : 'Results', value: featured.keyResults.length },
                  { label: isRTL ? 'محافظة' : 'Govs', value: featured.governorates.length },
                  { label: isRTL ? 'شهر' : 'Months', value: Math.round((new Date(featured.endDate).getTime() - new Date(featured.startDate).getTime()) / (1000*60*60*24*30)) },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>{new Date(featured.startDate).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year:'numeric', month:'short' })}</span>
                  <span className="font-bold text-white/60">{timelineProgress(featured.startDate, featured.endDate)}%</span>
                  <span>{new Date(featured.endDate).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year:'numeric', month:'short' })}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-400 rounded-full" style={{ width: `${timelineProgress(featured.startDate, featured.endDate)}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondary-400 font-black text-sm group-hover:gap-3 transition-all mt-5">
              {isRTL ? 'استعرض المشروع' : 'View Project'} <Arrow className="w-4 h-4" />
            </div>
          </div>
        </Link>
      )}

      {/* ── Grid view ── */}
      {viewMode === 'grid' && rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(project => {
            const status = STATUS[project.status]
            const duration = Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000*60*60*24*30))
            const progress = timelineProgress(project.startDate, project.endDate)
            const accentColor = sectorColorMap[project.sectorKey] || '#3b4cca'
            return (
              <Link
                key={project.id}
                href={`/${locale}/programs-projects/${project.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-primary-50">
                  <Image src={project.featuredImage} alt={project.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" unoptimized={isCmsHostedMediaUrl(project.featuredImage)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className={`absolute top-3 start-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${status.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${project.status === 'active' ? 'animate-pulse' : ''}`} />
                    {isRTL ? status.ar : status.en}
                  </div>
                  <div className="absolute bottom-3 start-3 text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: accentColor + 'dd' }}>
                    {project.sector[locale]}
                  </div>
                </div>
                <div className="h-0.5 w-full" style={{ background: accentColor }} />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-primary-500 text-base leading-snug mb-2 group-hover:text-secondary-500 transition-colors line-clamp-2">
                    {project.title[locale]}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-4">{project.shortDescription[locale]}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <Building2 className="w-3 h-3 shrink-0" /><span className="truncate max-w-[100px]">{project.donor[locale]}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <MapPin className="w-3 h-3 shrink-0" />{project.governorates.slice(0,2).join(', ')}{project.governorates.length > 2 ? ` +${project.governorates.length-2}` : ''}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-medium ${GENDER_COLORS[project.genderClassification]}`}>
                      <Users className="w-3 h-3 shrink-0" />
                      {(project.targetGenderLabels?.length
                        ? project.targetGenderLabels
                        : project.targetGenders?.length
                          ? project.targetGenders.map((g) => g === 'female' ? (isRTL ? 'إناث' : 'Female') : (isRTL ? 'ذكور' : 'Male'))
                          : [project.genderClassification === 'mixed' ? (isRTL ? 'مختلط' : 'Mixed') : project.genderClassification === 'female' ? (isRTL ? 'إناث' : 'Female') : project.genderClassification === 'male' ? (isRTL ? 'ذكور' : 'Male') : (isRTL ? 'شباب' : 'Youth')]
                      ).join(isRTL ? ' · ' : ' · ')}
                    </span>
                  </div>
                  <div className="mt-auto mb-3">
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(project.startDate).getFullYear()} – {new Date(project.endDate).getFullYear()}</span>
                      <span className="font-bold" style={{ color: accentColor }}>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
                    </div>
                  </div>
                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      <span className="font-black text-primary-500">{project.keyResults.length}</span> {isRTL ? 'نتيجة' : 'results'}
                      <span className="mx-1.5 text-neutral-200">·</span>
                      <span className="font-black text-primary-500">{duration}</span> {isRTL ? 'شهر' : 'mo'}
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
          {rest.map(project => {
            const status = STATUS[project.status]
            const progress = timelineProgress(project.startDate, project.endDate)
            const accentColor = sectorColorMap[project.sectorKey] || '#3b4cca'
            return (
              <Link
                key={project.id}
                href={`/${locale}/programs-projects/${project.slug}`}
                className="group flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={project.featuredImage} alt={project.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" unoptimized={isCmsHostedMediaUrl(project.featuredImage)} />
                </div>
                <div className="w-1 h-14 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${status.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{isRTL ? status.ar : status.en}
                    </span>
                    <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">{project.sector[locale]}</span>
                  </div>
                  <h3 className="font-black text-primary-500 text-sm leading-snug group-hover:text-secondary-500 transition-colors line-clamp-1 mb-1">{project.title[locale]}</h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{project.donor[locale]}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.governorates.slice(0,2).join(', ')}</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 w-28">
                  <span className="text-xs font-black" style={{ color: accentColor }}>{progress}%</span>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
                  </div>
                  <span className="text-xs text-neutral-400">{new Date(project.startDate).getFullYear()} – {new Date(project.endDate).getFullYear()}</span>
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
