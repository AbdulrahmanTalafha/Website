import type { Locale } from '@/types'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { PLACEHOLDER_HERO, rewriteLegacyImageUrl } from '@/lib/placeholderImages'

interface StatItem {
  value: string
  label: string
}

interface PageHeroProps {
  locale: Locale
  title: string
  subtitle?: string
  badge?: string
  badgeHref?: string
  image?: string
  stats?: StatItem[]
}

export default function PageHero({
  locale,
  title,
  subtitle,
  badge,
  badgeHref,
  image = PLACEHOLDER_HERO,
  stats,
}: PageHeroProps) {
  const isRTL = locale === 'ar'
  const heroImage = rewriteLegacyImageUrl(image)

  return (
    <section className="relative flex flex-col overflow-hidden" style={{ minHeight: '480px', height: '62vh' }} aria-label="Page Hero">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" aria-hidden="true" />
      <div
        className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/60 via-transparent to-transparent`}
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500" aria-hidden="true" />

      {/* Content — bottom aligned like homepage hero */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Badge above title */}
        {badge && (
          <div className="mb-4">
            {badgeHref ? (
              <Link
                href={badgeHref}
                className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold px-4 py-2 transition-colors uppercase tracking-wider"
              >
                {badge}
              </Link>
            ) : (
              <span className="inline-flex items-center bg-secondary-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base lg:text-lg text-white/75 leading-relaxed max-w-2xl mb-6">
            {subtitle}
          </p>
        )}

        {/* Stats strip */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-0 border-t border-white/15 pt-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-1 ${i > 0 ? (isRTL ? 'border-r border-white/20' : 'border-l border-white/20') : ''} first:ps-0`}
              >
                <div className="text-2xl lg:text-3xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5 whitespace-nowrap">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
