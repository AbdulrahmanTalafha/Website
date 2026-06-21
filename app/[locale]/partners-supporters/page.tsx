import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema } from '@/lib/seo'
import { buildCmsPageMetadata } from '@/lib/buildCmsPageMetadata'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import PartnersList from '@/components/partners/PartnersList'
import { getPartners } from '@/lib/api'
import { getSettings, getPartnersPageData } from '@/lib/cms'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolvePartnersPageSeo } from '@/lib/partnersPageSeo'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const [pageCms, settings] = await Promise.all([
    getPartnersPageData(locale),
    getSettings(locale),
  ])
  const site = resolveSiteSettings(settings, locale)
  const seo = resolvePartnersPageSeo(pageCms, locale)

  return buildCmsPageMetadata(site, {
    locale,
    canonicalPath: `/${locale}/partners-supporters`,
    title: seo.title,
    description: seo.description,
    noIndex: seo.noIndex,
  })
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ value: string; suffix?: string; label: string }> | undefined,
  partnersCount: number,
) {
  if (connected && useLiveStats) {
    return cmsStats?.length
      ? cmsStats.map((s) => ({
          value: `${partnersCount}${s.suffix ?? ''}`,
          label: s.label,
        }))
      : [{ value: `${partnersCount}`, label: '' }]
  }

  if (connected && cmsStats?.length) {
    return cmsStats.map((s) => ({
      value: `${s.value}${s.suffix ?? ''}`,
      label: s.label,
    }))
  }

  return [{ value: `${partnersCount}`, label: '' }]
}

export default async function PartnersPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const [partners, pageCms] = await Promise.all([
    getPartners(locale),
    getPartnersPageData(locale),
  ])

  const connected = cmsConnected(pageCms)
  const isRTL = locale === 'ar'
  const seo = resolvePartnersPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'الشركاء والداعمون' : 'Partners & Supporters',
  ) ?? (isRTL ? 'الشركاء والداعمون' : 'Partners & Supporters')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'نتعاون مع منظمات محلية ودولية لتحقيق أهدافنا المشتركة في تعزيز الديمقراطية وحقوق الإنسان'
      : 'We collaborate with local and international organizations to achieve shared goals in advancing democracy and human rights',
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'شركاؤنا' : 'Our Partners')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, placeholderPhotoUrl('werise-partners', 1400, 700))
    : placeholderPhotoUrl('werise-partners', 1400, 700)

  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? !connected,
    hero?.stats,
    partners.length,
  ).map((stat, index) => ({
    ...stat,
    label:
      stat.label ||
      hero?.stats?.[index]?.label ||
      (isRTL ? 'شريك وداعم' : 'Partners & Donors'),
  }))

  const listSection = pageCms?.sections?.partners_list
  const showList = !connected || listSection?.is_visible !== false
  const categoryOrder = listSection?.category_order
  const categoryLabels = pageCms?.config?.categories

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/partners-supporters` },
        ])}
      />

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

      {showList && (
        <PartnersList
          partners={partners}
          locale={locale}
          categoryOrder={categoryOrder}
          categoryLabels={categoryLabels}
        />
      )}
    </>
  )
}
