import type { Locale } from '@/types'
import type { CmsProjectsStats } from '@/lib/cms'
import type { Project } from '@/types'
import { formatBeneficiaryCountPlus } from '@/lib/mapCmsProject'
import { Folder, Users, TrendingUp, Globe2 } from 'lucide-react'

const SECTOR_ORDER = ['political-empowerment', 'economic-empowerment', 'digital-media'] as const
const AGE_BUCKET_ORDER = ['18-24', '25-30', '31-45', '45+'] as const

export interface DashboardWidgets {
  status?: boolean
  sectors?: boolean
  geographic?: boolean
  gender?: boolean
  age?: boolean
  beneficiary_cards?: boolean
}

interface ProjectsDashboardProps {
  locale: Locale
  projects: Project[]
  stats: CmsProjectsStats
  widgets: DashboardWidgets
}

export default function ProjectsDashboard({ locale, projects, stats, widgets }: ProjectsDashboardProps) {
  const isRTL = locale === 'ar'
  const statusTotal = stats.status.active + stats.status.completed + stats.status.upcoming
  const geoTotal = stats.geographic_level.local + stats.geographic_level.national
  const gender = stats.beneficiaries.gender
  const age = stats.beneficiaries.age

  const showStatus = widgets.status ?? true
  const showSectors = widgets.sectors ?? true
  const showGeographic = widgets.geographic ?? true
  const showGender = widgets.gender ?? true
  const showAge = widgets.age ?? true
  const showBeneficiaryCards = widgets.beneficiary_cards ?? true

  const hasStatusRow = showStatus || showSectors
  const hasGeoRow = showGeographic || showGender
  const hasAgeRow = showAge || showBeneficiaryCards

  return (
    <section className="py-12 bg-white border-b border-neutral-100">
      <div className="container-wide">
        {hasStatusRow && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {showStatus && (
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'حالة المشاريع' : 'Project Status'}</h3>
                </div>
                <div className="space-y-4">
                  {([
                    { key: 'active', label: isRTL ? 'نشطة' : 'Active', count: stats.status.active, color: 'bg-green-500' },
                    { key: 'completed', label: isRTL ? 'مكتملة' : 'Completed', count: stats.status.completed, color: 'bg-neutral-400' },
                    { key: 'upcoming', label: isRTL ? 'قادمة' : 'Upcoming', count: stats.status.upcoming, color: 'bg-blue-500' },
                  ] as const).map((item) => (
                    <div key={item.key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-neutral-600">{item.label}</span>
                        <span className="font-bold text-primary-500">{item.count}</span>
                      </div>
                      <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all`}
                          style={{ width: `${statusTotal ? Math.round(item.count / statusTotal * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSectors && (
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-5">
                  <Folder className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'توزيع المشاريع حسب القطاع' : 'Projects by Strategic Sector'}</h3>
                </div>
                <div className="space-y-4">
                  {SECTOR_ORDER.map((key, i) => {
                    const sector = stats.sectors[key]
                    const label = isRTL ? sector?.ar : sector?.en
                    const count = sector?.count ?? 0
                    const colors = ['#3b4cca', '#e63946', '#8b5cf6']
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1.5 gap-3">
                          <span className="font-medium text-neutral-600">{label}</span>
                          <span className="font-bold text-primary-500 shrink-0">{count}</span>
                        </div>
                        <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${projects.length ? Math.round(count / projects.length * 100) : 0}%`,
                              backgroundColor: colors[i],
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {hasGeoRow && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {showGeographic && (
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-5">
                  <Globe2 className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'التوزيع الجغرافي' : 'Geographic Distribution'}</h3>
                </div>
                <div className="space-y-4">
                  {([
                    { key: 'local', label: isRTL ? 'المستوى المحلي' : 'Local Level', count: stats.geographic_level.local, color: 'bg-secondary-500' },
                    { key: 'national', label: isRTL ? 'المستوى الوطني' : 'National Level', count: stats.geographic_level.national, color: 'bg-primary-500' },
                  ] as const).map((item) => (
                    <div key={item.key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-neutral-600">{item.label}</span>
                        <span className="font-bold text-primary-500">
                          {item.count} {isRTL ? 'مشروع' : 'projects'}
                        </span>
                      </div>
                      <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${geoTotal ? Math.round(item.count / geoTotal * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showGender && (
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-5">
                  <Users className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'المستفيدون حسب الجنس' : 'Beneficiaries by Gender'}</h3>
                </div>
                {gender ? (
                  <div className="space-y-4">
                    {[
                      { label: isRTL ? 'إناث' : 'Female', pct: gender.female_pct, color: 'bg-pink-500' },
                      { label: isRTL ? 'ذكور' : 'Male', pct: gender.male_pct, color: 'bg-blue-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-neutral-600">{item.label}</span>
                          <span className="font-bold text-primary-500">{item.pct}%</span>
                        </div>
                        <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">{isRTL ? 'لا تتوفر بيانات بعد' : 'No data available yet'}</p>
                )}
              </div>
            )}
          </div>
        )}

        {hasAgeRow && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {showAge && (
              <div className="lg:col-span-2 bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-5">
                  <Users className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-primary-500 text-sm">{isRTL ? 'المستفيدون حسب الفئة العمرية' : 'Beneficiaries by Age Group'}</h3>
                </div>
                {age ? (
                  <div className="flex items-end gap-3 h-40">
                    {AGE_BUCKET_ORDER
                      .filter((bucket) => age[bucket] != null)
                      .map((bucket, i) => {
                        const pct = age[bucket] as number
                        const barHeight = Math.min(100, Math.max(0, pct))
                        const displayPct = pct % 1 === 0 ? pct : Number(pct.toFixed(1))

                        return (
                          <div key={bucket} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-primary-500">{displayPct}%</span>
                            <div className="w-full h-28 bg-neutral-200 rounded-t-xl overflow-hidden flex items-end">
                              <div
                                className="w-full rounded-t-xl transition-all"
                                style={{
                                  height: `${barHeight}%`,
                                  backgroundColor: ['#3b4cca', '#e63946', '#8b5cf6', '#f59e0b'][i % 4],
                                }}
                              />
                            </div>
                            <span className="text-xs text-neutral-500 font-medium" dir="ltr">{bucket}</span>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">{isRTL ? 'لا تتوفر بيانات بعد' : 'No data available yet'}</p>
                )}
              </div>
            )}

            {showBeneficiaryCards && (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary-500 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">{isRTL ? 'مباشر' : 'Direct'}</p>
                  <p className="text-4xl font-black">{formatBeneficiaryCountPlus(stats.beneficiaries.direct)}</p>
                  <p className="text-sm text-white/80 mt-1">{isRTL ? 'مستفيد مباشر' : 'Direct beneficiaries'}</p>
                </div>
                <div className="bg-secondary-500 rounded-2xl p-6 text-white shadow-lg shadow-secondary-500/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">{isRTL ? 'غير مباشر' : 'Indirect'}</p>
                  <p className="text-4xl font-black">{formatBeneficiaryCountPlus(stats.beneficiaries.indirect)}</p>
                  <p className="text-sm text-white/80 mt-1">{isRTL ? 'مستفيد غير مباشر' : 'Indirect beneficiaries'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
