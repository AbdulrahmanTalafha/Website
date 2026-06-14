import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildCollectionPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import { getInitiatives } from '@/lib/api'
import InitiativesGrid from '@/components/initiatives/InitiativesGrid'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const description = locale === 'ar'
    ? 'تعرّف على مبادرات وحملات مركز We Rise لتعزيز المشاركة المدنية ومواجهة خطاب الكراهية والتوعية بالحقوق الرقمية'
    : 'Explore We Rise Center initiatives and campaigns promoting civic participation, countering hate speech, and raising digital rights awareness'
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/initiatives-campaigns`,
    customTitle: locale === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns',
    customDescription: description,
  })
}

export default async function InitiativesPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const initiatives = await getInitiatives(locale)
  const pageTitle = locale === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns'
  const pageDescription = locale === 'ar'
    ? 'تعرّف على مبادرات وحملات مركز We Rise لتعزيز المشاركة المدنية ومواجهة خطاب الكراهية والتوعية بالحقوق الرقمية'
    : 'Explore We Rise Center initiatives and campaigns promoting civic participation, countering hate speech, and raising digital rights awareness'

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/initiatives-campaigns` },
        ]),
        buildCollectionPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${BASE_URL}/${locale}/initiatives-campaigns`,
          locale,
        }),
      ]} />

      <PageHero
        locale={locale}
        title={pageTitle}
        subtitle={locale === 'ar'
          ? 'نطلق مبادرات وحملات وطنية لتعزيز المشاركة المدنية ومواجهة خطاب الكراهية والتوعية بالحقوق الرقمية'
          : 'National initiatives and campaigns to promote civic participation, counter hate speech, and raise digital rights awareness'}
        badge={locale === 'ar' ? 'مبادراتنا' : 'Our Initiatives'}
        image="https://picsum.photos/seed/werise-initiatives/1400/700"
        stats={[
          { value: String(initiatives.length), label: locale === 'ar' ? 'مبادرة وحملة' : 'Initiatives & Campaigns' },
          { value: String(initiatives.filter(i => !i.endDate || new Date(i.endDate) >= new Date()).length), label: locale === 'ar' ? 'نشاط جارٍ' : 'Active' },
        ]}
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <InitiativesGrid initiatives={initiatives} locale={locale} />
        </div>
      </section>
    </>
  )
}
