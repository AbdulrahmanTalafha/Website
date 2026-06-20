import { Fragment, type ReactNode } from 'react'
import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import { getProjects, getProjectsStats } from '@/lib/api'
import { getProjectsPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveProjectsPageSeo } from '@/lib/projectsPageSeo'
import { resolveProjectsPageSectionOrder } from '@/lib/projectsPageSectionOrder'
import { formatBeneficiaryCountPlus } from '@/lib/mapCmsProject'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import ProjectsDashboard from '@/components/projects/ProjectsDashboard'
import ProjectsKpiRow from '@/components/projects/ProjectsKpiRow'

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getProjectsPageData(locale)
  const seo = resolveProjectsPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/programs-projects`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex,
  })
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ value: string; suffix?: string; label: string }> | undefined,
  projectsCount: number,
  stats: Awaited<ReturnType<typeof getProjectsStats>>,
  isRTL: boolean,
) {
  if (connected && useLiveStats) {
    return [
      { value: `${projectsCount}`, label: isRTL ? 'مشروع' : 'Projects' },
      { value: `${stats.status.active}`, label: isRTL ? 'نشط الآن' : 'Active' },
      { value: `${stats.governorates_covered}`, label: isRTL ? 'محافظة' : 'Governorates' },
      { value: formatBeneficiaryCountPlus(stats.beneficiaries.direct), label: isRTL ? 'مستفيد مباشر' : 'Direct Reach' },
    ]
  }

  if (connected && cmsStats?.length) {
    return cmsStats.map((s) => ({
      value: `${s.value}${s.suffix ?? ''}`,
      label: s.label,
    }))
  }

  return [
    { value: `${projectsCount}`, label: isRTL ? 'مشروع' : 'Projects' },
    { value: `${stats.status.active}`, label: isRTL ? 'نشط الآن' : 'Active' },
    { value: `${stats.governorates_covered}`, label: isRTL ? 'محافظة' : 'Governorates' },
    { value: formatBeneficiaryCountPlus(stats.beneficiaries.direct), label: isRTL ? 'مستفيد مباشر' : 'Direct Reach' },
  ]
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params as { locale: Locale }
  const [projects, stats, pageCms] = await Promise.all([
    getProjects(locale),
    getProjectsStats(locale),
    getProjectsPageData(locale),
  ])

  const connected = cmsConnected(pageCms)
  const isRTL = locale === 'ar'
  const seo = resolveProjectsPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'البرامج والمشاريع' : 'Programs & Projects',
  ) ?? (isRTL ? 'البرامج والمشاريع' : 'Programs & Projects')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'مشاريع متنوعة في مجالات التمكين السياسي والاقتصادي والإعلام الرقمي'
      : 'Diverse projects across political empowerment, economic empowerment, and digital media',
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'برامجنا' : 'Our Programs')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, 'https://picsum.photos/seed/werise-programs/1400/700')
    : 'https://picsum.photos/seed/werise-programs/1400/700'

  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? !connected,
    hero?.stats,
    projects.length,
    stats,
    isRTL,
  )

  const sectionOrder = resolveProjectsPageSectionOrder(pageCms, connected)
  const gridTitle = cmsText(
    connected,
    pageCms?.sections?.projects_grid?.title,
    isRTL ? 'جميع المشاريع' : 'All Projects',
  ) ?? (isRTL ? 'جميع المشاريع' : 'All Projects')

  const dashboardWidgets = pageCms?.sections?.dashboard?.widgets ?? {}

  const sectionBlocks: Record<string, ReactNode> = {
    stats_kpi: (
      <ProjectsKpiRow locale={locale} projectsCount={projects.length} stats={stats} />
    ),
    dashboard: (
      <ProjectsDashboard
        locale={locale}
        projects={projects}
        stats={stats}
        widgets={dashboardWidgets}
      />
    ),
    projects_grid: (
      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="flex items-center gap-0 mb-8">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {gridTitle}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <ProjectsGrid projects={projects} locale={locale} />
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
          { name: pageTitle, url: `${BASE_URL}/${locale}/programs-projects` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: seo.description,
          url: `${BASE_URL}/${locale}/programs-projects`,
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

      {sectionOrder.map((key) => {
        if (!isSectionVisible(key)) return null
        const block = sectionBlocks[key]
        if (!block) return null
        return <Fragment key={key}>{block}</Fragment>
      })}
    </>
  )
}
