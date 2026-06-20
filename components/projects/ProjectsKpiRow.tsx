import type { Locale } from '@/types'
import type { CmsProjectsStats } from '@/lib/cms'
import { Folder, CheckCircle, MapPin, Building2 } from 'lucide-react'

interface ProjectsKpiRowProps {
  locale: Locale
  projectsCount: number
  stats: CmsProjectsStats
}

export default function ProjectsKpiRow({ locale, projectsCount, stats }: ProjectsKpiRowProps) {
  const isRTL = locale === 'ar'

  const items = [
    { icon: <Folder className="w-5 h-5 text-primary-500" />, bg: 'bg-primary-50', value: projectsCount, label: isRTL ? 'إجمالي المشاريع' : 'Total Projects' },
    { icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', value: stats.status.active, label: isRTL ? 'مشاريع نشطة' : 'Active Projects' },
    { icon: <MapPin className="w-5 h-5 text-secondary-500" />, bg: 'bg-secondary-50', value: stats.governorates_covered, label: isRTL ? 'محافظة مغطاة' : 'Governorates Covered' },
    { icon: <Building2 className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', value: stats.donors_count, label: isRTL ? 'جهة مانحة' : 'Donor Organizations' },
  ]

  return (
    <section className="py-8 bg-white border-b border-neutral-100">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>{stat.icon}</div>
              <div>
                <div className="text-3xl font-black text-primary-500 leading-none">{stat.value}</div>
                <div className="text-xs text-neutral-500 mt-1 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
