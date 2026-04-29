import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import { getInitiatives } from '@/lib/api'
import InitiativesGrid from '@/components/initiatives/InitiativesGrid'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/initiatives-campaigns`,
    customTitle: locale === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns',
  })
}

export default async function InitiativesPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const initiatives = await getInitiatives(locale)

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://werise.org.jo/${locale}` },
        { name: locale === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns', url: `https://werise.org.jo/${locale}/initiatives-campaigns` },
      ])} />

      <PageHero
        locale={locale}
        title={locale === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns'}
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
