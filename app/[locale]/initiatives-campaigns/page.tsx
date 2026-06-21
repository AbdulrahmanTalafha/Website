import { Fragment, type ReactNode } from 'react'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema } from '@/lib/seo'
import { buildCmsPageMetadata } from '@/lib/buildCmsPageMetadata'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import InitiativesGrid from '@/components/initiatives/InitiativesGrid'
import InitiativesKpiRow from '@/components/initiatives/InitiativesKpiRow'
import { getInitiatives, getInitiativesStats } from '@/lib/api'
import { getSettings, getInitiativesPageData } from '@/lib/cms'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveInitiativesPageSeo } from '@/lib/initiativesPageSeo'
import { resolveInitiativesPageSectionOrder } from '@/lib/initiativesPageSectionOrder'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const [pageCms, settings] = await Promise.all([
    getInitiativesPageData(locale),
    getSettings(locale),
  ])
  const site = resolveSiteSettings(settings, locale)
  const seo = resolveInitiativesPageSeo(pageCms, locale)

  return buildCmsPageMetadata(site, {
    locale,
    canonicalPath: `/${locale}/initiatives-campaigns`,
    title: seo.title,
    description: seo.description,
    noIndex: seo.noIndex,
  })
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }> | undefined,
  stats: { total: number; ongoing: number },
) {
  if (connected && useLiveStats && cmsStats?.length) {
    return cmsStats.map((stat) => {
      const liveValue = stat.stat_key === 'ongoing' ? stats.ongoing : stats.total

      return {
        value: `${liveValue}${stat.suffix ?? ''}`,
        label: stat.label,
      }
    })
  }

  if (connected && cmsStats?.length) {
    return cmsStats.map((s) => ({
      value: `${s.value}${s.suffix ?? ''}`,
      label: s.label,
    }))
  }

  return [
    { value: String(stats.total), label: '' },
    { value: String(stats.ongoing), label: '' },
  ]
}

export default async function InitiativesPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const [initiatives, stats, pageCms, settings] = await Promise.all([
    getInitiatives(locale),
    getInitiativesStats(locale),
    getInitiativesPageData(locale),
    getSettings(locale),
  ])
  const site = resolveSiteSettings(settings, locale)

  const connected = cmsConnected(pageCms)
  const isRTL = locale === 'ar'
  const seo = resolveInitiativesPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'المبادرات والحملات' : 'Initiatives & Campaigns',
  ) ?? (isRTL ? 'المبادرات والحملات' : 'Initiatives & Campaigns')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'نطلق مبادرات وحملات وطنية لتعزيز المشاركة المدنية ومواجهة خطاب الكراهية والتوعية بالحقوق الرقمية'
      : 'National initiatives and campaigns to promote civic participation, counter hate speech, and raise digital rights awareness',
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'مبادراتنا' : 'Our Initiatives')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, placeholderPhotoUrl('werise-initiatives', 1400, 700))
    : placeholderPhotoUrl('werise-initiatives', 1400, 700)

  const defaultLabels = isRTL
    ? ['مبادرة وحملة', 'نشاط جارٍ']
    : ['Initiatives & Campaigns', 'Active']

  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? !connected,
    hero?.stats,
    stats,
  ).map((stat, index) => ({
    ...stat,
    label: stat.label || defaultLabels[index] || defaultLabels[0],
  }))

  const sectionOrder = resolveInitiativesPageSectionOrder(pageCms, connected)
  const gridTitle = cmsText(
    connected,
    pageCms?.sections?.initiatives_grid?.title,
    isRTL ? 'جميع المبادرات والحملات' : 'All Initiatives & Campaigns',
  ) ?? (isRTL ? 'جميع المبادرات والحملات' : 'All Initiatives & Campaigns')

  const categoryLabels = pageCms?.config?.categories

  const sectionBlocks: Record<string, ReactNode> = {
    stats_kpi: (
      <InitiativesKpiRow locale={locale} total={stats.total} ongoing={stats.ongoing} />
    ),
    initiatives_grid: (
      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="flex items-center gap-0 mb-8">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {gridTitle}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <InitiativesGrid
            initiatives={initiatives}
            locale={locale}
            categoryLabels={categoryLabels}
          />
        </div>
      </section>
    ),
  }

  const isSectionVisible = (key: string): boolean => {
    if (!connected) return true
    const section = pageCms?.sections?.[key as keyof typeof pageCms.sections]
    if (!section) return false
    return section.is_visible !== false
  }

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/initiatives-campaigns` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: seo.description,
          url: `${BASE_URL}/${locale}/initiatives-campaigns`,
          locale,
          site,
        }),
      ]} />

      {(connected || !pageCms) && (
        <PageHero
          locale={locale}
          title={pageTitle}
          subtitle={pageSubtitle ?? undefined}
          badge={pageBadge ?? undefined}
          image={heroImage}
          stats={heroStats}
        />
      )}

      {sectionOrder.map((key) =>
        isSectionVisible(key) ? (
          <Fragment key={key}>{sectionBlocks[key]}</Fragment>
        ) : null,
      )}
    </>
  )
}
