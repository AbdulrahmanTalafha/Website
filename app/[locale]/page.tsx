import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
import type { Locale } from '@/types'
import { buildMetadata, buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Hero from '@/components/home/Hero'
import HomeStats from '@/components/home/HomeStats'
import LatestPublications from '@/components/home/LatestPublications'
import ObservatoryPreview from '@/components/home/ObservatoryPreview'
import LatestNews from '@/components/home/LatestNews'
import ContentCarousel from '@/components/home/ContentCarousel'
import type { CarouselItem } from '@/components/home/ContentCarousel'
import { getProjects, getPublications, getNews, getObservatoryData, getInitiatives } from '@/lib/api'
import Button from '@/components/common/Button'
import PartnersCarousel from '@/components/home/PartnersCarousel'
import NewsTicker from '@/components/home/NewsTicker'
import { partnersData } from '@/data/partners'
import { ArrowRight, ArrowLeft, Vote } from 'lucide-react'
import { getFocusAreaIcon } from '@/lib/focusAreaIcons'
import { getHomeData, getSettings } from '@/lib/cms'
import { cmsButton, cmsConnected, cmsRichHtml, cmsSectionVisible, cmsText } from '@/lib/cmsHomeContent'
import { resolveHomeSeo } from '@/lib/homeSeo'
import { resolveHomeSectionOrder } from '@/lib/homeSectionOrder'
import { staticPartnerLogoByNameEn } from '@/lib/partnerLogos'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'
import { cmsUrl } from '@/lib/cmsUrl'
import { mapCmsNewsToNewsItem } from '@/lib/mapCmsNews'
import type { CmsPublicationRecord, CmsProjectRecord, CmsInitiativeRecord, CmsNewsRecord } from '@/lib/cms'
import type { Publication, NewsItem } from '@/types'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

/** Re-fetch CMS SEO (and page data) periodically after deploy. */
export const revalidate = 60

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const cms = await getHomeData(locale)
  const settings = await getSettings(locale)
  const site = resolveSiteSettings(settings, locale)
  const seo = resolveHomeSeo(cms, locale, site)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}`,
    customTitle: seo.title,
    customDescription: seo.description,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    absoluteTitle: true,
    siteName: site.name,
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const loc = locale as Locale

  const [projects, publications, news, observatory, initiatives, cmsData, settings] = await Promise.all([
    getProjects(locale),
    getPublications(locale),
    getNews(locale),
    getObservatoryData(locale),
    getInitiatives(locale),
    getHomeData(locale),
    getSettings(locale),
  ])
  const site = resolveSiteSettings(settings, locale)

  // ─── CMS section helpers ─────────────────────────────────
  const connected = cmsConnected(cmsData)
  const cms = cmsData?.sections

  // News Ticker items
  const staticTickerItems = publications.slice(0, 8).map((p) => ({ id: p.id, slug: p.slug, title: p.title[loc] }))
  const tickerItems = connected
    ? ((cms?.news_ticker?.items?.length ?? 0) > 0
      ? cms!.news_ticker!.items.map((item, idx) => ({ id: String(idx), ...item }))
      : staticTickerItems)
    : staticTickerItems

  const tickerLabel = cmsText(
    connected,
    cms?.news_ticker?.label,
    locale === 'ar' ? 'تقارير' : 'Latest Reports',
  )
  const tickerHref = cmsUrl(
    connected
      ? (cms?.news_ticker?.url?.trim() || `/${locale}/publications-reports`)
      : `/${locale}/publications-reports`,
    locale,
  )

  // About intro CMS fields
  const staticAboutBadge = locale === 'ar' ? 'من نحن' : 'About Us'
  const aboutBadge = cmsText(connected, cms?.about_intro?.badge, staticAboutBadge)
  const aboutTitle = cmsText(
    connected,
    cms?.about_intro?.title,
    locale === 'ar' ? 'نعمل من أجل الحق والكرامة والمشاركة' : 'We Work for Rights, Dignity & Participation',
  )
  const aboutDesc1 = cmsRichHtml(
    connected,
    cms?.about_intro?.description,
    locale === 'ar'
      ? 'مركز We Rise للمواطنة والتنمية منظمة مدنية أردنية تأسست عام 2018 في عمّان. نعمل على تعزيز المشاركة المدنية الفاعلة، ودعم قيم الديمقراطية وحقوق الإنسان، ورصد الحقوق الرقمية وخطاب الكراهية الإلكتروني في الأردن.'
      : 'We Rise Center for Citizenship and Development is a Jordanian civil organization founded in 2018 in Amman. We work to promote active civic participation, support democratic values and human rights, and monitor digital rights and online hate speech in Jordan.',
  )
  const aboutDesc2 = !connected
    ? (locale === 'ar'
      ? 'من خلال برامج متنوعة تشمل التدريب، والبحث، والمناصرة، والرصد الرقمي، نسعى لبناء مجتمع أكثر وعيًا وعدالةً ومشاركةً.'
      : 'Through diverse programs including training, research, advocacy, and digital monitoring, we strive to build a more aware, just, and participatory society.')
    : null
  const aboutBtn1 = cmsButton(
    connected,
    cms?.about_intro?.primary_button,
    locale === 'ar' ? 'اعرف المزيد' : 'Learn More',
    `/${locale}/about`,
    locale,
  )
  const aboutBtn2 = cmsButton(
    connected,
    cms?.about_intro?.secondary_button,
    locale === 'ar' ? 'فريق العمل' : 'Our Team',
    `/${locale}/team-governance`,
    locale,
  )

  const staticFocusAreas = [
    {
      title: locale === 'ar' ? 'التمكين السياسي' : 'Political Empowerment',
      subtitle: locale === 'ar' ? 'تعزيز المشاركة السياسية والقيادة المدنية' : 'Strengthening political participation and civic leadership',
      icon: 'political-empowerment',
      color: 'primary',
    },
    {
      title: locale === 'ar' ? 'التمكين الاقتصادي' : 'Economic Empowerment',
      subtitle: locale === 'ar' ? 'توسيع الفرص الاقتصادية وتعزيز الاعتماد على الذات' : 'Expanding economic opportunities and self-reliance',
      icon: 'economic-empowerment',
      color: 'secondary',
    },
    {
      title: locale === 'ar' ? 'الإعلام الرقمي' : 'Digital Media',
      subtitle: locale === 'ar' ? 'تنمية مهارات الإعلام الرقمي والتواصل المسؤول' : 'Developing digital media skills and responsible communication',
      icon: 'digital-media',
      color: 'primary',
    },
  ]

  const cmsFocusAreas = (cms?.about_intro?.focus_areas ?? []).filter((item) => item.title?.trim())

  const aboutFocusAreas = connected
    ? cmsFocusAreas
    : (cmsFocusAreas.length > 0 ? cmsFocusAreas : staticFocusAreas)

  const showAboutSection = cmsSectionVisible(connected, cms, 'about_intro') && (!connected || aboutBadge || aboutTitle || aboutDesc1 || aboutDesc2 || aboutBtn1 || aboutBtn2 || aboutFocusAreas.length > 0)

  const focusColorMap = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
  } as const

  // Publications carousel items
  const staticPublicationItems: CarouselItem[] = publications.slice(0, 6).map((pub) => ({
    id: pub.id,
    href: `/${loc}/publications-reports/${pub.slug}`,
    title: pub.title[loc],
    shortDescription: pub.summary[loc],
    image: pub.coverImage,
    badge: loc === 'ar'
      ? pub.type === 'guide' ? 'دليل' : pub.type === 'report' ? 'تقرير' : 'إصدار'
      : pub.type === 'guide' ? 'Guide' : pub.type === 'report' ? 'Report' : 'Publication',
    date: new Date(pub.publishDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))
  const cmsPublicationRecords = cms?.publications_carousel?.records ?? []
  const publicationItems: CarouselItem[] = connected
    ? (cmsPublicationRecords.length > 0
      ? cmsPublicationRecords.map((r) => ({
        id: String((r as CmsPublicationRecord).id),
        href: `/${loc}/publications-reports/${(r as CmsPublicationRecord).slug}`,
        title: (r as CmsPublicationRecord).title,
        shortDescription: (r as CmsPublicationRecord).summary ?? '',
        image: resolveCmsMediaUrl(
          (r as CmsPublicationRecord).cover_image ?? (r as CmsPublicationRecord).image,
          publications.find((pub) => pub.slug === (r as CmsPublicationRecord).slug)?.coverImage,
          placeholderPhotoUrl(`pub-${(r as CmsPublicationRecord).slug}`, 800, 500),
        ),
        badge: loc === 'ar'
          ? ((r as CmsPublicationRecord).type === 'guide' ? 'دليل' : (r as CmsPublicationRecord).type === 'report' ? 'تقرير' : (r as CmsPublicationRecord).type === 'study' ? 'دراسة' : (r as CmsPublicationRecord).type === 'brief' ? 'موجز' : 'إصدار')
          : ((r as CmsPublicationRecord).type === 'guide' ? 'Guide' : (r as CmsPublicationRecord).type === 'report' ? 'Report' : (r as CmsPublicationRecord).type === 'study' ? 'Study' : (r as CmsPublicationRecord).type === 'brief' ? 'Brief' : 'Publication'),
        date: (r as CmsPublicationRecord).publication_date
          ? new Date((r as CmsPublicationRecord).publication_date!).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })
          : undefined,
      }))
      : staticPublicationItems)
    : staticPublicationItems

  const pubCarouselTitle = cmsText(
    connected,
    cms?.publications_carousel?.title,
    loc === 'ar' ? 'الإصدارات والتقارير' : 'Publications & Reports',
  )
  const pubCarouselViewAll = cmsButton(
    connected,
    cms?.publications_carousel?.view_all,
    loc === 'ar' ? 'عرض الكل' : 'View All',
    `/${loc}/publications-reports`,
    loc,
  )

  // Projects carousel items
  const staticProjectItems: CarouselItem[] = projects.slice(0, 6).map((p) => ({
    id: p.id,
    href: `/${loc}/programs-projects/${p.slug}`,
    title: p.title[loc],
    shortDescription: p.shortDescription[loc],
    image: p.featuredImage,
    badge: p.sector[loc],
    date: new Date(p.startDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))
  const cmsProjectRecords = cms?.projects_carousel?.records ?? []
  const projectItems: CarouselItem[] = connected
    ? (cmsProjectRecords.length > 0
      ? cmsProjectRecords.map((r) => ({
        id: String((r as CmsProjectRecord).id),
        href: `/${loc}/programs-projects/${(r as CmsProjectRecord).slug}`,
        title: (r as CmsProjectRecord).title,
        shortDescription: (r as CmsProjectRecord).summary ?? '',
        image: resolveCmsMediaUrl(
          (r as CmsProjectRecord).featured_image ?? (r as CmsProjectRecord).image,
          projects.find((proj) => proj.slug === (r as CmsProjectRecord).slug)?.featuredImage,
          placeholderPhotoUrl(`proj-${(r as CmsProjectRecord).slug}`, 800, 500),
        ),
        badge: (r as CmsProjectRecord).sector ?? (loc === 'ar' ? 'مشروع' : 'Project'),
        date: (r as CmsProjectRecord).start_date
          ? new Date((r as CmsProjectRecord).start_date!).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })
          : undefined,
      }))
      : staticProjectItems)
    : staticProjectItems

  const projCarouselTitle = cmsText(
    connected,
    cms?.projects_carousel?.title,
    loc === 'ar' ? 'البرامج والمشاريع' : 'Programs & Projects',
  )
  const projCarouselViewAll = cmsButton(
    connected,
    cms?.projects_carousel?.view_all,
    loc === 'ar' ? 'عرض الكل' : 'View All',
    `/${loc}/programs-projects`,
    loc,
  )

  // Initiatives carousel items
  const staticInitiativeItems: CarouselItem[] = initiatives.slice(0, 6).map((i) => ({
    id: i.id,
    href: `/${loc}/initiatives-campaigns`,
    title: i.title[loc],
    shortDescription: i.shortDescription[loc],
    image: i.featuredImage,
    badge: loc === 'ar' ? 'مبادرة' : 'Initiative',
    date: new Date(i.startDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))
  const cmsInitiativeRecords = cms?.initiatives_carousel?.records ?? []
  const initiativeItems: CarouselItem[] = connected
    ? (cmsInitiativeRecords.length > 0
      ? cmsInitiativeRecords.map((r) => ({
        id: String((r as CmsInitiativeRecord).id),
        href: `/${loc}/initiatives-campaigns`,
        title: (r as CmsInitiativeRecord).title,
        shortDescription: (r as CmsInitiativeRecord).summary ?? '',
        image: resolveCmsMediaUrl(
          (r as CmsInitiativeRecord).featured_image ?? (r as CmsInitiativeRecord).image,
          initiatives.find((init) => init.slug === (r as CmsInitiativeRecord).slug)?.featuredImage,
          placeholderPhotoUrl(`init-${(r as CmsInitiativeRecord).slug}`, 800, 500),
        ),
        badge: loc === 'ar' ? 'مبادرة' : 'Initiative',
        date: (r as CmsInitiativeRecord).start_date
          ? new Date((r as CmsInitiativeRecord).start_date!).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })
          : undefined,
      }))
      : staticInitiativeItems)
    : staticInitiativeItems

  const initCarouselTitle = cmsText(
    connected,
    cms?.initiatives_carousel?.title,
    loc === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns',
  )
  const initCarouselViewAll = cmsButton(
    connected,
    cms?.initiatives_carousel?.view_all,
    loc === 'ar' ? 'عرض الكل' : 'View All',
    `/${loc}/initiatives-campaigns`,
    loc,
  )

  // Latest Publications
  const cmsLatestPublicationRecords = cms?.latest_publications?.records ?? []
  const latestPubCount = connected ? (cms?.latest_publications?.count ?? 3) : 3
  const latestPublications: Publication[] = connected && cmsLatestPublicationRecords.length > 0
    ? cmsLatestPublicationRecords
        .map((r) => publications.find((p) => p.slug === (r as CmsPublicationRecord).slug))
        .filter((p): p is Publication => Boolean(p))
    : publications.slice(0, latestPubCount)

  const latestPubTitle = cmsText(
    connected,
    cms?.latest_publications?.title,
    locale === 'ar' ? 'أحدث المنشورات والتقارير' : 'Latest Publications & Reports',
  )
  const latestPubViewAll = cmsButton(
    connected,
    cms?.latest_publications?.view_all,
    locale === 'ar' ? 'المكتبة كاملة' : 'Full Library',
    `/${locale}/publications-reports`,
    locale,
  )

  // Latest News
  const cmsLatestNewsRecords = cms?.latest_news?.records ?? []
  const latestNewsCount = connected ? (cms?.latest_news?.count ?? 4) : 4
  const latestNews: NewsItem[] = connected && cmsLatestNewsRecords.length > 0
    ? cmsLatestNewsRecords
        .map((r) => {
          const record = r as CmsNewsRecord
          const fromList = news.find((item) => item.slug === record.slug)
          if (fromList) return fromList
          return mapCmsNewsToNewsItem({
            id: record.id,
            slug: record.slug,
            title_en: record.title ?? '',
            title_ar: record.title ?? '',
            summary_en: record.summary ?? '',
            summary_ar: record.summary ?? '',
            content_en: record.content ?? '',
            content_ar: record.content ?? '',
            category: record.category,
            published_at: record.published_at,
            cover_image: record.cover_image ?? record.image,
          })
        })
    : news.slice(0, latestNewsCount)

  const latestNewsTitle = cmsText(
    connected,
    cms?.latest_news?.title,
    locale === 'ar' ? 'آخر الأخبار والفعاليات' : 'Latest News & Events',
  )
  const latestNewsViewAll = cmsButton(
    connected,
    cms?.latest_news?.view_all,
    locale === 'ar' ? 'المركز الإعلامي' : 'Media Center',
    `/${locale}/media-center`,
    locale,
  )

  // Partners
  const cmsPartnerRecords = cms?.partners?.records ?? []
  const partnersForCarousel = connected
    ? (cmsPartnerRecords.length > 0
      ? cmsPartnerRecords.map((p) => ({
        id: String(p.id),
        name: {
          ar: p.name_ar ?? p.name,
          en: p.name_en ?? p.name,
        } as Record<string, string>,
        logo: resolveCmsMediaUrl(
          p.logo,
          staticPartnerLogoByNameEn(p.name_en ?? '', partnersData),
          placeholderPhotoUrl(`partner-${p.id}`, 200, 80),
        ),
        website: p.website_url ?? undefined,
        category: p.category,
      }))
      : partnersData)
    : partnersData

  const partnersTitle = cmsText(
    connected,
    cms?.partners?.title,
    locale === 'ar' ? 'شركاؤنا وداعمونا' : 'Partners & Supporters',
  )
  const partnersDescription = cmsText(
    connected,
    cms?.partners?.description,
    locale === 'ar'
      ? 'نفخر بشراكاتنا مع منظمات دولية ومحلية رائدة'
      : 'We are proud of our partnerships with leading international and local organizations',
  )
  const partnersViewAll = cmsButton(
    connected,
    cms?.partners?.view_all,
    locale === 'ar' ? 'عرض الكل' : 'View All',
    `/${locale}/partners-supporters`,
    locale,
  )

  // Observatory preview CMS fields
  const observatoryBadge = cmsText(
    connected,
    cms?.observatory_preview?.badge,
    locale === 'ar' ? 'المرصد الرقمي' : 'Digital Observatory',
  )
  const observatoryTitle = cmsText(
    connected,
    cms?.observatory_preview?.title,
    locale === 'ar' ? 'المرصد الرقمي لخطاب الكراهية' : 'Digital Hate Speech Observatory',
  )
  const observatoryDesc = cmsText(
    connected,
    cms?.observatory_preview?.description,
    locale === 'ar'
      ? 'نرصد ونوثق حالات خطاب الكراهية والعنف الرقمي في الأردن عبر منهجية علمية دقيقة'
      : 'We monitor and document hate speech and digital violence cases in Jordan with a precise scientific methodology',
  )
  const observatoryBtn1 = cmsButton(
    connected,
    cms?.observatory_preview?.primary_button,
    locale === 'ar' ? 'ادخل المرصد' : 'Enter Observatory',
    `/${locale}/digital-observatory`,
    locale,
  )
  const observatoryBtn2 = cmsButton(
    connected,
    cms?.observatory_preview?.secondary_button,
    locale === 'ar' ? 'تقارير المرصد' : 'Observatory Reports',
    `/${locale}/publications-reports`,
    locale,
  )

  // Home stats CMS fields
  const homeStatsTitle = cmsText(
    connected,
    cms?.home_stats?.title,
    locale === 'ar' ? 'أثرنا بالأرقام' : 'Our Impact in Numbers',
  )
  const homeStatsSubtitle = cmsText(
    connected,
    cms?.home_stats?.subtitle,
    locale === 'ar'
      ? 'منذ تأسيسنا عام 2018، نواصل العمل لبناء مجتمع أردني أكثر وعيًا ومشاركةً'
      : 'Since our founding in 2018, we continue working to build a more aware and participatory Jordanian society',
  )

  // E-Election CTA CMS fields
  const staticElectionBadge = locale === 'ar' ? 'منصة رقمية' : 'Digital Platform'
  const electionBadge = cmsText(connected, cms?.e_election_cta?.badge, staticElectionBadge)
  const electionTitle = cmsText(
    connected,
    cms?.e_election_cta?.title,
    locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform',
  )
  const electionDesc = cmsText(
    connected,
    cms?.e_election_cta?.description,
    locale === 'ar'
      ? 'شارك في الانتخابات الإلكترونية الشفافة والموثوقة عبر منصة We Rise — تجربة ديمقراطية حديثة وآمنة في متناول يدك.'
      : 'Participate in transparent and reliable electronic elections via the We Rise platform — a modern, secure democratic experience at your fingertips.',
  )
  const electionBtn1 = cmsButton(
    connected,
    cms?.e_election_cta?.primary_button,
    locale === 'ar' ? 'استكشف المنصة' : 'Explore Platform',
    `/${locale}/e-election-platform`,
    locale,
  )
  const electionBtn2 = cmsButton(
    connected,
    cms?.e_election_cta?.secondary_button,
    locale === 'ar' ? 'الانتخابات الحالية' : 'Current Elections',
    `/${locale}/e-election-platform`,
    locale,
  )
  const showElectionSection = cmsSectionVisible(connected, cms, 'e_election_cta') && (!connected || electionBadge || electionTitle || electionDesc || electionBtn1 || electionBtn2)

  // Contact CTA CMS fields
  const contactTitle = cmsText(
    connected,
    cms?.contact_cta?.title,
    locale === 'ar' ? 'تواصل معنا أو انضم إلينا' : 'Contact Us or Join Us',
  )
  const contactDesc = cmsText(
    connected,
    cms?.contact_cta?.description,
    locale === 'ar'
      ? 'يسعدنا التعاون معك أو الإجابة على استفساراتك'
      : 'We would love to collaborate with you or answer your inquiries',
  )
  const contactBtn1 = cmsButton(
    connected,
    cms?.contact_cta?.primary_button,
    locale === 'ar' ? 'اتصل بنا' : 'Contact Us',
    `/${locale}/contact`,
    locale,
  )
  const contactBtn2 = cmsButton(
    connected,
    cms?.contact_cta?.secondary_button,
    locale === 'ar' ? 'شركاؤنا' : 'Our Partners',
    `/${locale}/partners-supporters`,
    locale,
  )
  const showContactSection = cmsSectionVisible(connected, cms, 'contact_cta') && (!connected || contactTitle || contactDesc || contactBtn1 || contactBtn2)

  const orgSchema = buildOrganizationSchema(locale, site)
  const webSchema = buildWebsiteSchema(locale, site)
  const sectionOrder = resolveHomeSectionOrder(cmsData, connected)

  const sectionBlocks: Record<string, ReactNode> = {
    news_ticker: cmsSectionVisible(connected, cms, 'news_ticker') ? (
      <NewsTicker
        locale={locale}
        items={tickerItems}
        label={tickerLabel}
        href={tickerHref}
      />
    ) : null,

    about_intro: showAboutSection ? (
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div data-reveal="up">
              {aboutBadge && (
              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-secondary-50 text-secondary-600">
                {aboutBadge}
              </span>
              )}
              {aboutTitle && (
              <h2 className="text-3xl lg:text-4xl font-black text-primary-500 mb-5 text-balance leading-tight">
                {aboutTitle}
              </h2>
              )}
              {aboutDesc1 && (
              <div
                className="text-neutral-600 leading-relaxed mb-4 prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutDesc1 }}
              />
              )}
              {aboutDesc2 && (
              <p className="text-neutral-600 leading-relaxed mb-6">
                {aboutDesc2}
              </p>
              )}
              {(aboutBtn1 || aboutBtn2) && (
              <div className="flex flex-wrap gap-3">
                {aboutBtn1 && (
                <Button href={aboutBtn1.url} variant="primary" size="md" icon={<ArrowIcon className="w-4 h-4" />}>
                  {aboutBtn1.label}
                </Button>
                )}
                {aboutBtn2 && (
                <Button href={aboutBtn2.url} variant="outline" size="md">
                  {aboutBtn2.label}
                </Button>
                )}
              </div>
              )}
            </div>
            {aboutFocusAreas.length > 0 && (
            <div className="mt-8 lg:mt-0 grid grid-cols-2 max-[500px]:grid-cols-1 gap-4 max-[500px]:gap-3" data-reveal-stagger>
              {aboutFocusAreas.map((item, index) => {
                const IconComponent = getFocusAreaIcon(item.icon)
                const bgClass = focusColorMap[item.color as keyof typeof focusColorMap] ?? 'bg-primary-500'

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="bg-neutral-50 rounded-2xl p-5 max-[500px]:p-4 flex items-start gap-3 max-[500px]:gap-4"
                  >
                    <div className={`w-12 h-12 max-[500px]:w-11 max-[500px]:h-11 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-7 h-7 max-[500px]:w-6 max-[500px]:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-primary-500 text-sm max-[500px]:text-base mb-1 leading-snug">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs max-[500px]:text-sm text-neutral-500 leading-relaxed">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            )}
          </div>
        </div>
      </section>
    ) : null,

    publications_carousel: cmsSectionVisible(connected, cms, 'publications_carousel') ? (
      <ContentCarousel
        locale={loc}
        items={publicationItems}
        sectionTitle={pubCarouselTitle}
        viewAllHref={pubCarouselViewAll?.url}
        viewAllLabel={pubCarouselViewAll?.label}
      />
    ) : null,

    home_stats: cmsSectionVisible(connected, cms, 'home_stats') ? (
      <HomeStats
        locale={locale}
        title={homeStatsTitle}
        subtitle={homeStatsSubtitle}
        stats={cms?.home_stats?.stats}
        cmsConnected={connected}
      />
    ) : null,

    projects_carousel: cmsSectionVisible(connected, cms, 'projects_carousel') ? (
      <ContentCarousel
        locale={loc}
        items={projectItems}
        sectionTitle={projCarouselTitle}
        viewAllHref={projCarouselViewAll?.url}
        viewAllLabel={projCarouselViewAll?.label}
      />
    ) : null,

    observatory_preview: cmsSectionVisible(connected, cms, 'observatory_preview') ? (
      <ObservatoryPreview
        locale={locale}
        stats={observatory.stats}
        badge={observatoryBadge}
        title={observatoryTitle}
        description={observatoryDesc}
        primaryButton={observatoryBtn1}
        secondaryButton={observatoryBtn2}
        cmsConnected={connected}
      />
    ) : null,

    initiatives_carousel: cmsSectionVisible(connected, cms, 'initiatives_carousel') ? (
      <ContentCarousel
        locale={loc}
        items={initiativeItems}
        sectionTitle={initCarouselTitle}
        viewAllHref={initCarouselViewAll?.url}
        viewAllLabel={initCarouselViewAll?.label}
      />
    ) : null,

    latest_publications: cmsSectionVisible(connected, cms, 'latest_publications') ? (
      <LatestPublications
        locale={locale}
        publications={latestPublications}
        sectionTitle={latestPubTitle}
        viewAllLabel={latestPubViewAll?.label}
        viewAllHref={latestPubViewAll?.url}
      />
    ) : null,

    e_election_cta: showElectionSection ? (
      <section className="section-padding bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 end-0 w-[480px] h-[480px] rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 start-0 w-[320px] h-[320px] rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="container-wide relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div data-reveal="up">
              {electionBadge && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <Vote className="w-3.5 h-3.5" />
                {electionBadge}
              </div>
              )}
              {electionTitle && (
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                {electionTitle}
              </h2>
              )}
              {electionDesc && (
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-lg">
                {electionDesc}
              </p>
              )}
              {(electionBtn1 || electionBtn2) && (
              <div className="flex flex-wrap gap-3">
                {electionBtn1 && (
                <Button href={electionBtn1.url} variant="white" size="lg">
                  {electionBtn1.label}
                </Button>
                )}
                {electionBtn2 && (
                <Button href={electionBtn2.url} variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                  {electionBtn2.label}
                </Button>
                )}
              </div>
              )}
            </div>

            <div className="mt-12 lg:mt-0 grid grid-cols-2 gap-4" data-reveal-stagger>
              {[
                { value: '+٢٠٠', valueEn: '200+', label: locale === 'ar' ? 'انتخاب منجز' : 'Elections Completed' },
                { value: '+١٥ ألف', valueEn: '15K+', label: locale === 'ar' ? 'ناخب مسجّل' : 'Registered Voters' },
                { value: '٩٨٪', valueEn: '98%', label: locale === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate' },
                { value: '٢٤/٧', valueEn: '24/7', label: locale === 'ar' ? 'دعم مستمر' : 'Continuous Support' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-3xl font-black text-white mb-1">
                    {locale === 'ar' ? stat.value : stat.valueEn}
                  </p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ) : null,

    latest_news: cmsSectionVisible(connected, cms, 'latest_news') ? (
      <LatestNews
        locale={locale}
        news={latestNews}
        sectionTitle={latestNewsTitle}
        viewAllLabel={latestNewsViewAll?.label}
        viewAllHref={latestNewsViewAll?.url}
      />
    ) : null,

    partners: cmsSectionVisible(connected, cms, 'partners') ? (
      <PartnersCarousel
        locale={locale}
        partners={partnersForCarousel}
        title={partnersTitle}
        description={partnersDescription}
        viewAllLabel={partnersViewAll?.label}
        viewAllHref={partnersViewAll?.url}
      />
    ) : null,

    contact_cta: showContactSection ? (
      <section className="py-16 bg-primary-50">
        <div className="container-wide text-center" data-reveal="up">
          {contactTitle && (
          <h2 className="text-2xl lg:text-3xl font-black text-primary-500 mb-4">
            {contactTitle}
          </h2>
          )}
          {contactDesc && (
          <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
            {contactDesc}
          </p>
          )}
          {(contactBtn1 || contactBtn2) && (
          <div className="flex flex-wrap justify-center gap-3">
            {contactBtn1 && (
            <Button href={contactBtn1.url} variant="primary" size="lg">
              {contactBtn1.label}
            </Button>
            )}
            {contactBtn2 && (
            <Button href={contactBtn2.url} variant="outline" size="lg">
              {contactBtn2.label}
            </Button>
            )}
          </div>
          )}
        </div>
      </section>
    ) : null,
  }

  return (
    <>
      <JsonLd data={[orgSchema, webSchema]} />

      {/* Hero is mandatory — always first, not part of reorderable sections */}
      <Hero locale={locale} cmsData={cmsData} />

      {sectionOrder.map((key) => {
        const block = sectionBlocks[key]
        if (!block) return null

        return <Fragment key={key}>{block}</Fragment>
      })}
    </>
  )
}
