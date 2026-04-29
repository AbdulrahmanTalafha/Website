import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import { getProjects } from '@/lib/api'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import { Folder, CheckCircle, MapPin, Building2, Users, TrendingUp, Clock } from 'lucide-react'

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/programs-projects`,
    customTitle: locale === 'ar' ? 'البرامج والمشاريع' : 'Programs & Projects',
    customDescription: locale === 'ar'
      ? 'استعرض جميع برامج ومشاريع مركز We Rise في مجالات المواطنة والديمقراطية والحقوق الرقمية والتماسك الاجتماعي'
      : 'Explore all We Rise Center programs and projects in citizenship, democracy, digital rights, and social cohesion',
  })
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params as { locale: Locale }
  const projects = await getProjects(locale)

  const active    = projects.filter(p => p.status === 'active').length
  const completed = projects.filter(p => p.status === 'completed').length
  const upcoming  = projects.filter(p => p.status === 'upcoming').length
  const govs      = Array.from(new Set(projects.flatMap(p => p.governorates)))
  const donors    = Array.from(new Set(projects.map(p => p.donor[locale])))

  const mixed  = projects.filter(p => p.genderClassification === 'mixed').length
  const female = projects.filter(p => p.genderClassification === 'female').length
  const male   = projects.filter(p => p.genderClassification === 'male').length
  const youth  = projects.filter(p => p.genderClassification === 'youth').length

  const sectorMap: Record<string, number> = {}
  projects.forEach(p => { sectorMap[p.sector[locale]] = (sectorMap[p.sector[locale]] || 0) + 1 })
  const topSectors = Object.entries(sectorMap).sort((a,b) => b[1]-a[1]).slice(0,4)

  const isRTL = locale === 'ar'

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: isRTL ? 'الرئيسية' : 'Home', url: `https://werise.org.jo/${locale}` },
        { name: isRTL ? 'البرامج والمشاريع' : 'Programs & Projects', url: `https://werise.org.jo/${locale}/programs-projects` },
      ])} />

      <PageHero
        locale={locale}
        title={isRTL ? 'البرامج والمشاريع' : 'Programs & Projects'}
        subtitle={isRTL
          ? 'مشاريع متنوعة في مجالات المواطنة والديمقراطية والحقوق الرقمية والنوع الاجتماعي والتماسك المجتمعي'
          : 'Diverse projects in citizenship, democracy, digital rights, gender equality, and social cohesion'}
        badge={isRTL ? 'برامجنا' : 'Our Programs'}
        image="https://picsum.photos/seed/werise-programs/1400/700"
        stats={[
          { value: `${projects.length}`, label: isRTL ? 'مشروع' : 'Projects' },
          { value: `${active}`, label: isRTL ? 'نشط الآن' : 'Active' },
          { value: `${govs.length}`, label: isRTL ? 'محافظة' : 'Governorates' },
          { value: '85K+', label: isRTL ? 'مستفيد' : 'Beneficiaries' },
        ]}
      />

      {/* ── DASHBOARD ── */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container-wide">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Folder className="w-5 h-5 text-primary-500" />,    bg: 'bg-primary-50',    value: projects.length, label: isRTL ? 'إجمالي المشاريع' : 'Total Projects' },
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50',      value: active,          label: isRTL ? 'مشاريع نشطة' : 'Active Projects' },
              { icon: <MapPin className="w-5 h-5 text-secondary-500" />,  bg: 'bg-secondary-50',  value: govs.length,     label: isRTL ? 'محافظة مغطاة' : 'Governorates Covered' },
              { icon: <Building2 className="w-5 h-5 text-blue-600" />,   bg: 'bg-blue-50',       value: donors.length,   label: isRTL ? 'جهة مانحة' : 'Donor Organizations' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>{stat.icon}</div>
                <div>
                  <div className="text-3xl font-black text-primary-500 leading-none">{stat.value}</div>
                  <div className="text-xs text-neutral-500 mt-1 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Gender breakdown */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'توزيع حسب الجنس' : 'Projects by Gender Focus'}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: isRTL ? 'مختلط' : 'Mixed',  count: mixed,  color: 'bg-purple-500', pct: projects.length ? Math.round(mixed/projects.length*100) : 0 },
                  { label: isRTL ? 'إناث' : 'Female',  count: female, color: 'bg-pink-500',   pct: projects.length ? Math.round(female/projects.length*100) : 0 },
                  { label: isRTL ? 'ذكور' : 'Male',    count: male,   color: 'bg-blue-500',   pct: projects.length ? Math.round(male/projects.length*100) : 0 },
                  { label: isRTL ? 'شباب' : 'Youth',   count: youth,  color: 'bg-orange-500', pct: projects.length ? Math.round(youth/projects.length*100) : 0 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-neutral-600">{item.label}</span>
                      <span className="font-bold text-primary-500">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{width:`${item.pct}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status donut */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'حالة المشاريع' : 'Project Status'}</h3>
              </div>
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5"
                      strokeDasharray={`${projects.length ? Math.round(active/projects.length*100) : 0} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-primary-500">{active}</span>
                    <span className="text-xs text-neutral-400">{isRTL ? 'نشط' : 'active'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: isRTL ? 'نشط' : 'Active',     count: active,    dot: 'bg-green-500' },
                  { label: isRTL ? 'مكتمل' : 'Completed', count: completed, dot: 'bg-neutral-400' },
                  { label: isRTL ? 'قادم' : 'Upcoming',   count: upcoming,  dot: 'bg-blue-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                      <span className="text-xs text-neutral-600">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-primary-500">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top sectors */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'أبرز القطاعات' : 'Top Sectors'}</h3>
              </div>
              <div className="space-y-3">
                {topSectors.map(([sector, count], i) => (
                  <div key={sector}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-neutral-600 truncate me-2">{sector}</span>
                      <span className="font-bold text-primary-500 shrink-0">{count}</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${Math.round(count/projects.length*100)}%`, background:['#3b4cca','#e63946','#8b5cf6','#f59e0b'][i]}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID + FILTERS ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="flex items-center gap-0 mb-8">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {isRTL ? 'جميع المشاريع' : 'All Projects'}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <ProjectsGrid projects={projects} locale={locale} />
        </div>
      </section>
    </>
  )
}
