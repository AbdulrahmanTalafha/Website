import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildMetadata, buildOrganizationSchema, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import AboutContent from '@/components/about/AboutContent'
import { getAboutPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveAboutPageSeo } from '@/lib/aboutPageSeo'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getAboutPageData(locale)
  const seo = resolveAboutPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/about`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex,
  })
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getAboutPageData(locale)

  const connected = cmsConnected(pageCms)
  const isRTL = locale === 'ar'
  const hero = pageCms?.sections?.hero

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'عن المركز' : 'About the Center',
  ) ?? (isRTL ? 'عن المركز' : 'About the Center')

  const pageBadge = cmsText(
    connected,
    hero?.badge,
    isRTL ? 'مركز نحن ننهض' : 'We Rise Center',
  )

  const heroImage = resolveCmsMediaUrl(
    hero?.background_image,
    undefined,
    'https://picsum.photos/seed/werise-about/1400/700',
  )

  const schemas = [
    buildOrganizationSchema(locale),
    buildBreadcrumbSchema([
      { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
      { name: isRTL ? 'من نحن' : 'About Us', url: `${BASE_URL}/${locale}/about` },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        locale={locale}
        title={pageTitle ?? ''}
        badge={pageBadge ?? undefined}
        image={heroImage}
      />

      <div className="bg-white">
        <AboutContent locale={locale} pageCms={pageCms} connected={connected} />
      </div>
    </>
  )
}
