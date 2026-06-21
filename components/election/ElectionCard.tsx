import Image from 'next/image'
import type { Election, Locale } from '@/types'
import { CalendarDays, Users, Building2 } from 'lucide-react'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'

const statusLabels: Record<string, Record<string, string>> = {
  active: { ar: 'جارية الآن', en: 'Active Now' },
  upcoming: { ar: 'قادمة', en: 'Upcoming' },
  completed: { ar: 'مكتملة', en: 'Completed' },
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  upcoming: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  completed: 'bg-white/10 text-white/60 border-white/10',
}

const cardAccent: Record<string, string> = {
  active: 'border-green-500/25 hover:border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.08)]',
  upcoming: 'border-blue-500/20 hover:border-blue-500/35',
  completed: 'border-white/10 hover:border-white/20',
}

interface Props {
  election: Election
  locale: Locale
  featured?: boolean
}

export default function ElectionCard({ election, locale, featured = false }: Props) {
  const isActive = election.status === 'active'

  return (
    <article
      className={`group rounded-2xl overflow-hidden border bg-white/[0.04] backdrop-blur-sm transition-all duration-300 ${cardAccent[election.status]} ${
        featured ? 'md:col-span-2' : ''
      } ${isActive ? 'ring-1 ring-green-500/20' : ''}`}
    >
      {election.image && (
        <div className={`relative overflow-hidden bg-primary-800 ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}>
          <Image
            src={election.image}
            alt={election.title[locale]}
            fill
            className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            unoptimized={isCmsHostedMediaUrl(election.image)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />
          {isActive && (
            <div className="absolute top-4 end-4 flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-black px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {statusLabels.active[locale]}
            </div>
          )}
        </div>
      )}

      <div className={`p-5 ${featured ? 'md:p-7' : ''}`}>
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          {!isActive && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles[election.status]}`}>
              {statusLabels[election.status][locale]}
            </span>
          )}
          <span className="text-xs text-white/40 font-medium">{election.type[locale]}</span>
        </div>

        <h3 className={`font-black text-white mb-2 leading-snug group-hover:text-secondary-300 transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {election.title[locale]}
        </h3>
        <p className="text-white/55 text-sm mb-4 line-clamp-2 leading-relaxed">{election.description[locale]}</p>

        <div className="flex flex-wrap gap-4 text-xs text-white/45 mb-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-secondary-400/80" />
            <span dir="ltr">{election.startDate} — {election.endDate}</span>
          </div>
          {election.totalVoters != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-secondary-400/80" />
              <span>{election.totalVoters.toLocaleString()} {locale === 'ar' ? 'ناخب' : 'voters'}</span>
            </div>
          )}
          {election.totalCandidates != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-secondary-400/80" />
              <span>{election.totalCandidates.toLocaleString()} {locale === 'ar' ? 'مرشح' : 'candidates'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/35 pt-3 border-t border-white/10">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{election.organization[locale]}</span>
        </div>
      </div>
    </article>
  )
}
