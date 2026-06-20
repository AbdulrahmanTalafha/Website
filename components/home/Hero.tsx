import Link from 'next/link'
import type { Locale } from '@/types'
import { heroData } from '@/data/home'
import type { CmsHomeData } from '@/lib/cms'
import { getHeroSection } from '@/lib/cms'
import { cmsAssetUrl } from '@/lib/cmsUrl'
import { cmsButton, cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react'

interface HeroProps {
  locale: Locale
  /** Pre-fetched home CMS payload — avoids duplicate API calls when provided by the page. */
  cmsData?: CmsHomeData | null
}

/**
 * Hero is mandatory on the Home page — always renders.
 * Optional sections use cmsSectionVisible(); Hero has no CMS visibility toggle.
 */
export default async function Hero({ locale, cmsData = null }: HeroProps) {
  const connected = cmsConnected(cmsData)
  const cmsHero = getHeroSection(cmsData)

  const title = cmsText(
    connected,
    cmsHero?.title,
    heroData.title[locale],
  )
  const subtitle = cmsText(
    connected,
    cmsHero?.subtitle,
    heroData.subtitle[locale],
  )
  const staticHeroBadge = locale === 'ar' ? 'المواطنة والديمقراطية' : 'Citizenship & Democracy'
  const badge = cmsText(connected, cmsHero?.badge, staticHeroBadge)

  const primaryBtn = cmsButton(
    connected,
    cmsHero?.primary_button,
    heroData.ctaPrimary[locale],
    `/${locale}/programs-projects`,
  )
  const secondaryBtn = cmsButton(
    connected,
    cmsHero?.secondary_button,
    heroData.ctaSecondary[locale],
    `/${locale}/publications-reports`,
  )
  const tertiaryBtn = cmsButton(
    connected,
    cmsHero?.tertiary_link,
    locale === 'ar' ? 'المرصد الرقمي' : 'Digital Observatory',
    `/${locale}/digital-observatory`,
  )

  const backgroundImage = connected
    ? cmsAssetUrl(cmsHero?.background_image)
    : (cmsAssetUrl(cmsHero?.background_image) ?? heroData.imagePlaceholder)

  const resolveUrl = (url: string) => {
    if (url.startsWith('/') && !url.startsWith(`/${locale}/`)) return `/${locale}${url}`
    return url
  }

  const staticStats = [
    { value: '47', suffix: '+', label: locale === 'ar' ? 'مشروع منفَّذ' : 'Projects' },
    { value: '85K', suffix: '+', label: locale === 'ar' ? 'مستفيد مباشر' : 'Beneficiaries' },
    { value: '62', suffix: '+', label: locale === 'ar' ? 'منشور وتقرير' : 'Publications' },
    { value: '12', suffix: '', label: locale === 'ar' ? 'محافظة مُغطَّاة' : 'Governorates' },
    { value: '2018', suffix: '', label: locale === 'ar' ? 'سنة التأسيس' : 'Founded' },
  ]

  const stats = connected
    ? (cmsHero?.stats ?? []).filter((s) => s.label?.trim() && s.value?.trim())
    : (cmsHero?.stats?.length ? cmsHero.stats : staticStats)

  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="relative h-[82vh] min-h-[560px] flex flex-col overflow-hidden" aria-label="Hero">
      {backgroundImage && (
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" aria-hidden="true" />
      <div
        className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/60 via-transparent to-transparent`}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {badge && (
        <div className="mb-5">
          <Link
            href={primaryBtn ? resolveUrl(primaryBtn.url) : `/${locale}/programs-projects`}
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold px-4 py-2 transition-colors uppercase tracking-wider"
          >
            {badge}
          </Link>
        </div>
        )}

        {title && (
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-white mb-5 max-w-3xl max-[500px]:leading-[3rem] xl:leading-[5rem]">
          {title.trim()}
        </h1>
        )}

        {subtitle && (
        <p className="text-base lg:text-lg text-white/75 leading-relaxed mb-8 max-w-2xl">
          {subtitle}
        </p>
        )}

        {(primaryBtn || secondaryBtn || tertiaryBtn) && (
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {primaryBtn && (
          <Link
            href={resolveUrl(primaryBtn.url)}
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold px-6 py-3 text-sm transition-colors"
          >
            {primaryBtn.label}
            <ArrowIcon className="w-4 h-4" />
          </Link>
          )}
          {secondaryBtn && (
          <Link
            href={resolveUrl(secondaryBtn.url)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 text-sm transition-colors"
          >
            {secondaryBtn.label}
          </Link>
          )}
          {tertiaryBtn && (
          <Link
            href={resolveUrl(tertiaryBtn.url)}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors underline-offset-4 hover:underline"
          >
            {tertiaryBtn.label}
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
          )}
        </div>
        )}

        {stats.length > 0 && (
        <div className="flex flex-wrap items-center gap-0 border-t border-white/15 pt-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`px-6 py-1 ${i > 0 ? (isRTL ? 'border-r border-white/20' : 'border-l border-white/20') : ''} first:ps-0`}
            >
              <div className="text-2xl lg:text-3xl font-black text-white">{s.value}{s.suffix}</div>
              <div className="text-xs text-white/50 mt-0.5 whitespace-nowrap">{s.label}</div>
            </div>
          ))}
        </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
