import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { Suspense } from 'react'
import { buildCmsPageMetadata } from '@/lib/buildCmsPageMetadata'
import { getSettings } from '@/lib/cms'
import { resolveSiteSettings } from '@/lib/siteSettings'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import SearchPageClient from '@/components/search/SearchPageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const settings = await getSettings(locale)
  const site = resolveSiteSettings(settings, locale)

  return buildCmsPageMetadata(site, {
    locale,
    canonicalPath: `/${locale}/search`,
    title: locale === 'ar' ? 'البحث' : 'Search',
    description: site.seo.defaultDescription,
    noIndex: true,
  })
}

export default async function SearchPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }

  return (
    <>
      <div className="bg-primary-500 text-white py-16">
        <div className="container-wide">
          <Breadcrumbs locale={locale} items={[{ label: locale === 'ar' ? 'البحث' : 'Search' }]} light />
          <h1 className="text-4xl font-black mt-4">{locale === 'ar' ? 'البحث' : 'Search'}</h1>
          <p className="text-white/70 mt-2 text-sm max-w-xl">
            {locale === 'ar'
              ? 'ابحث في الصفحات، المشاريع، الإصدارات، الأخبار، المبادرات، الشركاء، وفريق العمل'
              : 'Search pages, projects, publications, news, initiatives, partners, and team'}
          </p>
        </div>
      </div>

      <section className="section-padding bg-neutral-50 min-h-[50vh]">
        <div className="container-wide max-w-3xl">
          <Suspense fallback={null}>
            <SearchPageClient locale={locale} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
