import type { Locale } from '@/types'
import { Lightbulb, Zap } from 'lucide-react'

interface InitiativesKpiRowProps {
  locale: Locale
  total: number
  ongoing: number
}

export default function InitiativesKpiRow({ locale, total, ongoing }: InitiativesKpiRowProps) {
  const isRTL = locale === 'ar'

  const items = [
    {
      icon: <Lightbulb className="w-5 h-5 text-primary-500" />,
      bg: 'bg-primary-50',
      value: total,
      label: isRTL ? 'مبادرة وحملة' : 'Initiatives & Campaigns',
    },
    {
      icon: <Zap className="w-5 h-5 text-green-600" />,
      bg: 'bg-green-50',
      value: ongoing,
      label: isRTL ? 'نشاط جارٍ' : 'Ongoing Activities',
    },
  ]

  return (
    <section className="py-8 bg-white border-b border-neutral-100">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {items.map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-neutral-100/80`}>
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-primary-500">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
