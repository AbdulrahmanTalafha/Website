import { Fragment, type ReactNode } from 'react'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import PublicationsGrid from '@/components/publications/PublicationsGrid'
import { getPublications, getPublicationsStats } from '@/lib/api'
import { getPublicationsPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolvePublicationsPageSeo } from '@/lib/publicationsPageSeo'
import { resolvePublicationsPageSectionOrder } from '@/lib/publicationsPageSectionOrder'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getPublicationsPageData(locale)
  const seo = resolvePublicationsPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/publications-reports`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex,
  })
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ stat_key?: string | null; value: string; suffix?: string; label: string }> | undefined,
  stats: { total: number; by_type: Record<string, number> },
) {
  if (connected && useLiveStats && cmsStats?.length) {
    return cmsStats.map((stat) => {
      const statKey = stat.stat_key ?? 'total'
      const liveValue = statKey === 'total'
        ? stats.total
        : (stats.by_type[statKey] ?? 0)

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

  return [{ value: String(stats.total), label: '' }]
}

export default async function PublicationsPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const [publications, stats, pageCms] = await Promise.all([
    getPublications(locale),
    getPublicationsStats(locale),
    getPublicationsPageData(locale),
  ])

  const connected = cmsConnected(pageCms)
  const isRTL = locale === 'ar'
  const seo = resolvePublicationsPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'المنشورات والتقارير' : 'Publications & Reports',
  ) ?? (isRTL ? 'المنشورات والتقارير' : 'Publications & Reports')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'أبحاث وتقارير ودراسات وأوراق سياسات في مجالات الديمقراطية والحقوق الرقمية وخطاب الكراهية'
      : 'Research, reports, studies and policy papers on democracy, digital rights, and hate speech',
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'إصداراتنا' : 'Our Publications')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, 'https://picsum.photos/seed/werise-publications/1400/700')
    : 'https://picsum.photos/seed/werise-publications/1400/700'

  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? !connected,
    hero?.stats,
    stats,
  ).map((stat, index) => ({
    ...stat,
    label: stat.label || (index === 0
      ? (isRTL ? 'منشور وتقرير' : 'Publications')
      : stat.label),
  }))

  const sectionOrder = resolvePublicationsPageSectionOrder(pageCms, connected)
  const gridTitle = cmsText(
    connected,
    pageCms?.sections?.publications_grid?.title,
    isRTL ? 'جميع المنشورات والتقارير' : 'All Publications & Reports',
  ) ?? (isRTL ? 'جميع المنشورات والتقارير' : 'All Publications & Reports')

  const typeLabels = pageCms?.config?.types

  const sectionBlocks: Record<string, ReactNode> = {
    publications_grid: (
      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="flex items-center gap-0 mb-8">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {gridTitle}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <PublicationsGrid
            publications={publications}
            locale={locale}
            typeLabels={typeLabels}
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
          { name: pageTitle, url: `${BASE_URL}/${locale}/publications-reports` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: seo.description,
          url: `${BASE_URL}/${locale}/publications-reports`,
          locale,
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
