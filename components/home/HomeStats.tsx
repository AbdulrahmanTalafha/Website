import type { Locale } from '@/types'
import { statsData } from '@/data/home'
import StatCard from '@/components/common/StatCard'
import SectionHeader from '@/components/common/SectionHeader'

interface HomeStatsProps {
  locale: Locale
}

export default function HomeStats({ locale }: HomeStatsProps) {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 section-padding relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 end-0 w-[32rem] h-[32rem] bg-secondary-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-40 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="container-wide relative z-10">
        <SectionHeader
          title={locale === 'ar' ? 'أثرنا بالأرقام' : 'Our Impact in Numbers'}
          subtitle={locale === 'ar'
            ? 'منذ تأسيسنا عام 2018، نواصل العمل لبناء مجتمع أردني أكثر وعيًا ومشاركةً'
            : 'Since our founding in 2018, we continue working to build a more aware and participatory Jordanian society'
          }
          align="center"
          light
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-reveal-stagger>
          {statsData.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label[locale]}
              light
            />
          ))}
        </div>
      </div>
    </section>
  )
}
