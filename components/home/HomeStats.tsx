import type { Locale } from '@/types'
import type { CmsStat } from '@/lib/cms'
import { statsData } from '@/data/home'
import StatCard from '@/components/common/StatCard'
import SectionHeader from '@/components/common/SectionHeader'

interface HomeStatsProps {
  locale: Locale
  title?: string | null
  subtitle?: string | null
  stats?: CmsStat[] | null
  cmsConnected?: boolean
}

export default function HomeStats({
  locale,
  title,
  subtitle,
  stats,
  cmsConnected = false,
}: HomeStatsProps) {
  const staticTitle = locale === 'ar' ? 'أثرنا بالأرقام' : 'Our Impact in Numbers'
  const staticSubtitle = locale === 'ar'
    ? 'منذ تأسيسنا عام 2018، نواصل العمل لبناء مجتمع أردني أكثر وعيًا ومشاركةً'
    : 'Since our founding in 2018, we continue working to build a more aware and participatory Jordanian society'

  const displayTitle = cmsConnected ? (title?.trim() || null) : (title?.trim() || staticTitle)
  const displaySubtitle = cmsConnected ? (subtitle?.trim() || null) : (subtitle?.trim() || staticSubtitle)

  const displayStats = cmsConnected
    ? (stats ?? [])
        .filter((s) => s.label?.trim() && s.value?.trim())
        .map((stat) => ({
          kind: 'text' as const,
          value: stat.value,
          suffix: stat.suffix ?? '',
          label: stat.label,
        }))
    : statsData.map((stat) => ({
        kind: 'numeric' as const,
        value: stat.value,
        suffix: stat.suffix,
        label: stat.label[locale],
      }))

  if (cmsConnected && !displayTitle && !displaySubtitle && displayStats.length === 0) {
    return null
  }

  const statsCount = displayStats.length
  const statsGridClass =
    statsCount <= 1
      ? 'grid grid-cols-1 max-w-xs mx-auto gap-4'
      : statsCount === 2
        ? 'grid grid-cols-2 max-w-2xl mx-auto gap-4'
        : statsCount === 3
          ? 'grid grid-cols-2 md:grid-cols-3 max-w-3xl mx-auto gap-4'
          : statsCount === 4
            ? 'grid grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto gap-4'
            : statsCount === 5
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-5xl mx-auto gap-4'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'

  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 section-padding relative overflow-hidden">
      <div className="absolute top-0 end-0 w-[32rem] h-[32rem] bg-secondary-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-40 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="container-wide relative z-10">
        <SectionHeader
          title={displayTitle}
          subtitle={displaySubtitle}
          align="center"
          light
        />
        {displayStats.length > 0 && (
        <div className={statsGridClass} data-reveal-stagger>
          {displayStats.map((stat, index) => (
            stat.kind === 'numeric' ? (
            <StatCard
              key={`${stat.label}-${index}`}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              light
            />
            ) : (
            <div
              key={`${stat.label}-${index}`}
              className="group relative text-center p-5 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/15 hover:bg-white/14 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-500 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-baseline justify-center gap-0.5 mb-1">
                  <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-none tabular-nums">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                  <span className="text-lg lg:text-xl font-black text-secondary-400 leading-none">
                    {stat.suffix}
                  </span>
                  )}
                </div>
                <div className="w-8 h-px bg-secondary-500/60 mx-auto my-2.5" />
                <p className="text-xs lg:text-sm font-semibold text-white/70 leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
            )
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
