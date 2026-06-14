import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import { getPublications } from '@/lib/api'
import PublicationsGrid from '@/components/publications/PublicationsGrid'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const description = locale === 'ar'
    ? 'أبحاث وتقارير ودراسات وأوراق سياسات صادرة عن مركز We Rise في الديمقراطية والحقوق الرقمية وخطاب الكراهية'
    : 'Research, reports, studies, and policy papers from We Rise Center on democracy, digital rights, and hate speech'
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/publications-reports`,
    customTitle: locale === 'ar' ? 'المنشورات والتقارير' : 'Publications & Reports',
    customDescription: description,
  })
}

export default async function PublicationsPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const publications = await getPublications(locale)
  const pageTitle = locale === 'ar' ? 'المنشورات والتقارير' : 'Publications & Reports'
  const pageDescription = locale === 'ar'
    ? 'أبحاث وتقارير ودراسات وأوراق سياسات صادرة عن مركز We Rise في الديمقراطية والحقوق الرقمية وخطاب الكراهية'
    : 'Research, reports, studies, and policy papers from We Rise Center on democracy, digital rights, and hate speech'

  const types = ['report', 'study', 'policy-paper', 'guide', 'brief']
  const typeLabels: Record<string, Record<string, string>> = {
    'report':       { ar: 'تقرير',        en: 'Report' },
    'study':        { ar: 'دراسة',        en: 'Study' },
    'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper' },
    'guide':        { ar: 'دليل',         en: 'Guide' },
    'brief':        { ar: 'موجز',         en: 'Brief' },
  }

  const countsByType = types
    .map(t => ({ value: String(publications.filter(p => p.type === t).length), label: typeLabels[t][locale] }))
    .filter(t => Number(t.value) > 0)

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/publications-reports` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${BASE_URL}/${locale}/publications-reports`,
          locale,
        }),
      ]} />

      <PageHero
        locale={locale}
        title={pageTitle}
        subtitle={locale === 'ar'
          ? 'أبحاث وتقارير ودراسات وأوراق سياسات في مجالات الديمقراطية والحقوق الرقمية وخطاب الكراهية'
          : 'Research, reports, studies and policy papers on democracy, digital rights, and hate speech'}
        badge={locale === 'ar' ? 'إصداراتنا' : 'Our Publications'}
        image="https://picsum.photos/seed/werise-publications/1400/700"
        stats={[
          { value: String(publications.length), label: locale === 'ar' ? 'منشور وتقرير' : 'Publications' },
          ...countsByType,
        ]}
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <PublicationsGrid publications={publications} locale={locale} />
        </div>
      </section>
    </>
  )
}
