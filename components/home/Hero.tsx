import Link from 'next/link'
import type { Locale } from '@/types'
import { heroData } from '@/data/home'
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react'

interface HeroProps {
  locale: Locale
}

export default function Hero({ locale }: HeroProps) {
  const hero = heroData
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="relative h-[82vh] min-h-[560px] flex flex-col overflow-hidden" aria-label="Hero">

      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${hero.imagePlaceholder})` }}
        aria-hidden="true"
      />

      {/* Multi-layer overlay: dark on bottom, slight on top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" aria-hidden="true" />
      {/* Side gradient for RTL/LTR readability */}
      <div
        className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/60 via-transparent to-transparent`}
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500" aria-hidden="true" />

      {/* Content — pushed to bottom */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Category badge */}
        <div className="mb-5">
          <Link
            href={`/${locale}/programs-projects`}
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold px-4 py-2 transition-colors uppercase tracking-wider"
          >
            {locale === 'ar' ? 'المواطنة والديمقراطية' : 'Citizenship & Democracy'}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-white leading-[1.6] mb-5 max-w-3xl">
          {hero.title[locale]}
        </h1>

        {/* Subtitle */}
        <p className="text-base lg:text-lg text-white/75 leading-relaxed mb-8 max-w-2xl">
          {hero.subtitle[locale]}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link
            href={`/${locale}/programs-projects`}
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold px-6 py-3 text-sm transition-colors"
          >
            {hero.ctaPrimary[locale]}
            <ArrowIcon className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/publications-reports`}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 text-sm transition-colors"
          >
            {hero.ctaSecondary[locale]}
          </Link>
          <Link
            href={`/${locale}/digital-observatory`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors underline-offset-4 hover:underline"
          >
            {locale === 'ar' ? 'المرصد الرقمي' : 'Digital Observatory'}
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center gap-0 border-t border-white/15 pt-6">
          {[
            { v: '47+', l: locale === 'ar' ? 'مشروع منفَّذ' : 'Projects' },
            { v: '85K+', l: locale === 'ar' ? 'مستفيد مباشر' : 'Beneficiaries' },
            { v: '62+', l: locale === 'ar' ? 'منشور وتقرير' : 'Publications' },
            { v: '12', l: locale === 'ar' ? 'محافظة مُغطَّاة' : 'Governorates' },
            { v: '2018', l: locale === 'ar' ? 'سنة التأسيس' : 'Founded' },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`px-6 py-1 ${i > 0 ? (isRTL ? 'border-r border-white/20' : 'border-l border-white/20') : ''} first:ps-0`}
            >
              <div className="text-2xl lg:text-3xl font-black text-white">{s.v}</div>
              <div className="text-xs text-white/50 mt-0.5 whitespace-nowrap">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
