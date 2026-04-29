import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildOrganizationSchema, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import AboutContent from '@/components/about/AboutContent'
import { getAboutPage } from '@/lib/api'
import { partnersData } from '@/data/partners'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/about`,
    customTitle: locale === 'ar' ? 'من نحن' : 'About Us',
    customDescription: locale === 'ar'
      ? 'تعرف على مركز We Rise للمواطنة والتنمية — رؤيتنا، رسالتنا، قيمنا، ومجالات عملنا'
      : 'Learn about We Rise Center for Citizenship & Development — our vision, mission, values, and work areas',
  })
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params as { locale: Locale }
  const about = await getAboutPage(locale)

  const schemas = [
    buildOrganizationSchema(locale),
    buildBreadcrumbSchema([
      { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://werise.org.jo/${locale}` },
      { name: locale === 'ar' ? 'من نحن' : 'About Us', url: `https://werise.org.jo/${locale}/about` },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        locale={locale}
        title={locale === 'ar' ? 'من نحن' : 'About Us'}
        subtitle={about.intro[locale]}
        badge={locale === 'ar' ? 'تعرف علينا' : 'Who We Are'}
        image="https://picsum.photos/seed/werise-about/1400/700"
        stats={[
          { value: '2018', label: locale === 'ar' ? 'سنة التأسيس' : 'Founded' },
          { value: '47+', label: locale === 'ar' ? 'مشروع منفَّذ' : 'Projects' },
          { value: '85K+', label: locale === 'ar' ? 'مستفيد مباشر' : 'Beneficiaries' },
          { value: '12', label: locale === 'ar' ? 'محافظة مُغطَّاة' : 'Governorates' },
        ]}
      />

      <div className="bg-white">
        <AboutContent locale={locale} about={about} partners={partnersData} />
      </div>
    </>
  )
}
